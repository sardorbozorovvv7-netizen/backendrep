const {
  Superadmin,
  Manager,
  Category,
  Product,
  User,
  HistoryModel,
  CartHistory,
  LikesHistory,
} = require('../models');
const { sendTelegramMessage } = require('../utils/telegram');

// Helper for simulating different active users (User, Manager, Superadmin)
const getActiveRole = async (req) => {
  const role = req.headers['x-user-role'] || 'user';
  const userId = req.headers['x-user-id'] || '1';
  return { role, userId: parseInt(userId, 10) };
};

// ==========================================
// AUTH & USERS CONTROLLERS
// ==========================================

const currentAuth = async (req, res) => {
  try {
    const { role, userId } = await getActiveRole(req);
    if (role === 'superadmin') {
      const admin = await Superadmin.findByPk(userId);
      return res.json({ role, user: admin || { name: 'Super Admin', email: 'admin@shop.uz' } });
    } else if (role === 'manager') {
      const manager = await Manager.findByPk(userId);
      return res.json({ role, user: manager || { username: 'manager1', email: 'manager@shop.uz' } });
    } else {
      const user = await User.findByPk(userId);
      return res.json({ role, user: user || null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, surname, phone } = req.body;
    const email = `${phone}@shop.uz`;
    const fullName = `${name} ${surname || ''}`.trim();

    // Check if user already exists
    let user = await User.findOne({ where: { phone } });

    if (!user) {
      user = await User.create({
        name: fullName,
        email,
        phone,
        likesHistory: '',
        OrderHistory: '',
        cartHistory: '',
      });
    }

    const msg = `🔔 <b>Yangi foydalanuvchi!</b>\n\n` +
                `<b>Ism:</b> ${name}\n` +
                `<b>Familiya:</b> ${surname || ''}\n` +
                `<b>Telefon raqami:</b> ${phone}`;
    
    await sendTelegramMessage(msg);

    res.status(201).json({ role: 'user', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getManagers = async (req, res) => {
  try {
    const managers = await Manager.findAll();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createManager = async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username va email kiritilishi shart!' });
    }

    const newManager = await Manager.create({
      username,
      email,
      phone,
      status: 1,
      history: { createdBy: 'superadmin', date: new Date().toISOString() },
    });
    res.status(201).json(newManager);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    await Manager.destroy({ where: { id } });
    res.json({ message: 'Manager deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// CATEGORIES CONTROLLERS
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { role } = await getActiveRole(req);
    
    if (role === 'user') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const newCategory = await Category.create({
      name,
      status: true,
      history: { createdBy: role, date: new Date().toISOString() },
    });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = await getActiveRole(req);
    
    if (role === 'user') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await Category.destroy({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// PRODUCTS CONTROLLERS
// ==========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { role } = await getActiveRole(req);
    if (role === 'user') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { name, category, price, saleprice, salePercent, quantity, images } = req.body;
    const nowStr = new Date().toISOString();

    const newProduct = await Product.create({
      name,
      category,
      price: price.toString(),
      saleprice: (saleprice || price).toString(),
      salePercent: parseInt(salePercent || 0, 10),
      quantity: quantity.toString(),
      images: images || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
      status: true,
      likes: '0',
      createdAt: nowStr,
      updatedAt: nowStr,
      history: { addedBy: role, date: nowStr },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { role } = await getActiveRole(req);
    if (role === 'user') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { name, category, price, saleprice, salePercent, quantity, images, status } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update({
      name: name !== undefined ? name : product.name,
      category: category !== undefined ? category : product.category,
      price: price !== undefined ? price.toString() : product.price,
      saleprice: saleprice !== undefined ? saleprice.toString() : product.saleprice,
      salePercent: salePercent !== undefined ? parseInt(salePercent, 10) : product.salePercent,
      quantity: quantity !== undefined ? quantity.toString() : product.quantity,
      images: images !== undefined ? images : product.images,
      status: status !== undefined ? status : product.status,
      updatedAt: new Date().toISOString(),
      history: { ...(product.history || {}), updatedBy: role, lastUpdate: new Date().toISOString() },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { role } = await getActiveRole(req);
    if (role === 'user') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const productIdStr = req.params.id.toString();

    // Check if user already liked the product
    const existingLike = await LikesHistory.findOne({
      where: { productid: productIdStr, UserId: userId }
    });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let currentLikes = parseInt(product.likes || 0, 10);

    if (existingLike) {
      await existingLike.destroy();
      currentLikes = Math.max(0, currentLikes - 1);
      await product.update({ likes: currentLikes.toString() });
      res.json({ liked: false, likes: currentLikes });
    } else {
      await LikesHistory.create({
        productid: productIdStr,
        UserId: userId,
        likedAt: new Date(),
      });
      currentLikes += 1;
      await product.update({ likes: currentLikes.toString() });
      res.json({ liked: true, likes: currentLikes });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const likes = await LikesHistory.findAll({ where: { UserId: userId } });
    res.json(likes.map(l => parseInt(l.productid, 10)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// CART CONTROLLERS
// ==========================================

const getCart = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const cartItems = await CartHistory.findAll({ where: { UserId: userId } });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const { ProductId, quantity } = req.body;

    let cartItem = await CartHistory.findOne({
      where: { ProductId: ProductId.toString(), UserId: userId }
    });

    const nowStr = new Date().toISOString();

    if (cartItem) {
      cartItem.quantity += parseInt(quantity || 1, 10);
      cartItem.updatedAt = nowStr;
      await cartItem.save();
    } else {
      cartItem = await CartHistory.create({
        ProductId: ProductId.toString(),
        UserId: userId,
        quantity: parseInt(quantity || 1, 10),
        history: 'Added to cart',
        createdAt: nowStr,
        updatedAt: nowStr,
      });
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCartQty = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const { quantity } = req.body;

    const cartItem = await CartHistory.findOne({
      where: { id: req.params.id, UserId: userId }
    });

    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });

    cartItem.quantity = parseInt(quantity, 10);
    cartItem.updatedAt = new Date().toISOString();
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    await CartHistory.destroy({
      where: { id: req.params.id, UserId: userId }
    });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// ORDER / HISTORYMODEL CONTROLLERS
// ==========================================

const getOrders = async (req, res) => {
  try {
    const { role, userId } = await getActiveRole(req);
    
    let orders;
    if (role === 'user') {
      orders = await HistoryModel.findAll({ where: { UserId: userId } });
    } else {
      orders = await HistoryModel.findAll();
    }
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkout = async (req, res) => {
  try {
    const { userId } = await getActiveRole(req);
    const cartItems = await CartHistory.findAll({ where: { UserId: userId } });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const user = await User.findByPk(userId);
    const userName = user ? user.name : "Noma'lum Mijoz";
    const userPhone = user ? user.phone : "Noma'lum Telefon";

    const nowStr = new Date().toISOString();
    const createdOrders = [];
    let productDetailsList = [];
    let totalPrice = 0;

    for (const item of cartItems) {
      const product = await Product.findByPk(parseInt(item.ProductId, 10));
      if (!product) continue;

      let stock = parseInt(product.quantity || 0, 10);
      let orderQty = item.quantity;
      let newStock = Math.max(0, stock - orderQty);
      await product.update({ quantity: newStock.toString() });

      const itemPrice = parseFloat(product.saleprice || product.price || 0);
      totalPrice += itemPrice * orderQty;

      productDetailsList.push(`• <b>${product.name}</b> (${orderQty} ta x $${itemPrice})`);

      const order = await HistoryModel.create({
        ProductId: item.ProductId,
        UserId: userId,
        quantity: orderQty,
        history: JSON.stringify({
          pricePaid: (product.saleprice || product.price).toString(),
          productName: product.name,
          status: 'Completed',
        }),
        createdAt: nowStr,
        updatedAt: nowStr,
      });

      createdOrders.push(order);
    }

    await CartHistory.destroy({ where: { UserId: userId } });

    const orderMsg = `🛍️ <b>Yangi zakaz!</b>\n\n` +
                     `<b>Foydalanuvchi:</b> ${userName}\n` +
                     `<b>Telefon raqami:</b> ${userPhone}\n\n` +
                     `<b>Mahsulotlar:</b>\n${productDetailsList.join('\n')}\n\n` +
                     `<b>Jami summa:</b> $${totalPrice.toFixed(2)}`;
    
    await sendTelegramMessage(orderMsg);

    res.status(201).json({ message: 'Checkout successful', orders: createdOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  currentAuth,
  registerUser,
  getManagers,
  createManager,
  deleteManager,
  getUsers,
  getCategories,
  createCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleLike,
  getLikes,
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  getOrders,
  checkout,
  getActiveRole // Export just in case
};
