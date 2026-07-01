const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 1. Superadmin Model
const Superadmin = sequelize.define('Superadmin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  history: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'superadmin',
  timestamps: false,
});

// 2. Manager Model
const Manager = sequelize.define('Manager', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER, // BigInt/Integer in schema
    defaultValue: 1,
  },
  history: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'Manager',
  timestamps: false,
});

// 3. Category Model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  history: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'Category',
  timestamps: false,
});

// 4. Products Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  history: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.TEXT, // Blob in schema, but TEXT is perfect for Base64 or URLs
    allowNull: true,
  },
  likes: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  quantity: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  saleprice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salePercent: {
    type: DataTypes.INTEGER, // Bigint in schema
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Products',
  timestamps: false, // Custom handling or disable default timestamps
});

// 5. User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likesHistory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  OrderHistory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cartHistory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'User',
  timestamps: false,
});

// 6. HistoryModel (Orders)
const HistoryModel = sequelize.define('HistoryModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProductId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  history: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'HistoryModel',
  timestamps: false,
});

// 7. CartHistory Model
const CartHistory = sequelize.define('CartHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProductId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  history: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'CartHistory',
  timestamps: false,
});

// 8. LikesHistory Model
const LikesHistory = sequelize.define('LikesHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'LikesHistory',
  timestamps: false,
});

// Defining Relations (Associations)
Product.belongsTo(Category, { foreignKey: 'category', targetKey: 'name', as: 'categoryData' });
Category.hasMany(Product, { foreignKey: 'category', sourceKey: 'name', as: 'products' });

HistoryModel.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
User.hasMany(HistoryModel, { foreignKey: 'UserId', as: 'orders' });

CartHistory.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
User.hasMany(CartHistory, { foreignKey: 'UserId', as: 'cart' });

LikesHistory.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
User.hasMany(LikesHistory, { foreignKey: 'UserId', as: 'likes' });

module.exports = {
  sequelize,
  Superadmin,
  Manager,
  Category,
  Product,
  User,
  HistoryModel,
  CartHistory,
  LikesHistory,
};
