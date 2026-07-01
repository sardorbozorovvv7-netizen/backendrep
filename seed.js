const { sequelize, Superadmin, Manager, Category, Product, User } = require('./models');

const seedDatabase = async () => {
  try {
    // Sync database, force true to clear database on seeding
    await sequelize.sync({ force: true });
    console.log('Database synced for seeding.');

    // 1. Create Superadmin
    await Superadmin.create({
      username: 'admin',
      name: 'Super Admin',
      email: 'admin@shop.uz',
      phone: '+998901234567',
      status: true,
      history: { action: 'Database initialized', date: new Date().toISOString() },
    });

    // 2. Create Manager
    await Manager.create({
      username: 'manager1',
      email: 'manager1@shop.uz',
      phone: '+998907654321',
      status: 1,
      history: { action: 'Manager account created', date: new Date().toISOString() },
    });

    // 3. Create User
    const defaultUser = await User.create({
      name: 'Shoxrux Shodiyev',
      email: 'shoxrux@shop.uz',
      phone: '+998931112233',
      likesHistory: '',
      OrderHistory: '',
      cartHistory: '',
    });

    // 4. Create Categories
    const categories = [
      { name: 'Apple', status: true, history: { created: 'System' } },
      { name: 'Samsung', status: true, history: { created: 'System' } },
      { name: 'Xiaomi', status: true, history: { created: 'System' } },
      { name: 'Google', status: true, history: { created: 'System' } },
    ];
    await Category.bulkCreate(categories);
    console.log('Categories seeded.');

    // 5. Create Products (Phones)
    const nowStr = new Date().toISOString();
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        status: true,
        history: { addedBy: 'admin' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
        likes: '12',
        quantity: '45',
        price: '1400',
        saleprice: '1299',
        salePercent: 7,
        category: 'Apple',
      },
      {
        name: 'iPhone 14 Pro',
        status: true,
        history: { addedBy: 'admin' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60',
        likes: '8',
        quantity: '20',
        price: '1100',
        saleprice: '999',
        salePercent: 9,
        category: 'Apple',
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        status: true,
        history: { addedBy: 'admin' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
        likes: '15',
        quantity: '30',
        price: '1300',
        saleprice: '1199',
        salePercent: 8,
        category: 'Samsung',
      },
      {
        name: 'Samsung Galaxy A55',
        status: true,
        history: { addedBy: 'manager1' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500&auto=format&fit=crop&q=60',
        likes: '5',
        quantity: '60',
        price: '450',
        saleprice: '450',
        salePercent: 0,
        category: 'Samsung',
      },
      {
        name: 'Xiaomi 14 Ultra',
        status: true,
        history: { addedBy: 'manager1' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
        likes: '9',
        quantity: '25',
        price: '1100',
        saleprice: '950',
        salePercent: 13,
        category: 'Xiaomi',
      },
      {
        name: 'Redmi Note 13 Pro',
        status: true,
        history: { addedBy: 'manager1' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
        likes: '22',
        quantity: '100',
        price: '350',
        saleprice: '299',
        salePercent: 14,
        category: 'Xiaomi',
      },
      {
        name: 'Google Pixel 8 Pro',
        status: true,
        history: { addedBy: 'admin' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
        likes: '14',
        quantity: '15',
        price: '999',
        saleprice: '899',
        salePercent: 10,
        category: 'Google',
      },
      {
        name: 'Google Pixel 7a',
        status: true,
        history: { addedBy: 'admin' },
        createdAt: nowStr,
        updatedAt: nowStr,
        images: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
        likes: '3',
        quantity: '40',
        price: '499',
        saleprice: '449',
        salePercent: 10,
        category: 'Google',
      },
    ];

    await Product.bulkCreate(products);
    console.log('Products seeded.');
    console.log('Database seeding complete successfully.');
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
