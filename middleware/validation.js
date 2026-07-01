// Request Body Validations Middleware for Phone E-Commerce App

const validateRegister = (req, res, next) => {
  const { name, phone } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Ism kamida 2 ta belgidan iborat bo'lishi shart!" });
  }
  
  // Clean phone number regex (+998901234567 or similar)
  if (!phone || !/^\+?[0-9]{9,15}$/.test(phone)) {
    return res.status(400).json({ error: "Telefon raqami noto'g'ri formatda! Masalan: +998901234567" });
  }
  
  next();
};

const validateProduct = (req, res, next) => {
  const { name, category, price, quantity } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Telefon nomi kamida 2 ta belgidan iborat bo'lishi shart!" });
  }
  
  if (!category || category.trim().length === 0) {
    return res.status(400).json({ error: "Turkum tanlanishi shart!" });
  }
  
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ error: "Telefon narxi 0 dan katta musbat son bo'lishi shart!" });
  }
  
  const qtyNum = parseInt(quantity, 10);
  if (isNaN(qtyNum) || qtyNum < 0) {
    return res.status(400).json({ error: "Telefon miqdori (omborda) 0 dan kichik bo'lishi mumkin emas!" });
  }
  
  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Turkum nomi kamida 2 ta belgidan iborat bo'lishi shart!" });
  }
  
  next();
};

const validateCart = (req, res, next) => {
  const { ProductId, quantity } = req.body;
  
  if (!ProductId) {
    return res.status(400).json({ error: "Mahsulot ID kiritilishi shart!" });
  }
  
  if (quantity !== undefined) {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Savatga qo'shiladigan telefon miqdori kamida 1 bo'lishi shart!" });
    }
  }
  
  next();
};

const validateCartQty = (req, res, next) => {
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ error: "Telefon miqdori kiritilishi shart!" });
  }

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: "Telefon miqdori kamida 1 ta bo'lishi shart!" });
  }

  next();
};

module.exports = {
  validateRegister,
  validateProduct,
  validateCategory,
  validateCart,
  validateCartQty
};
