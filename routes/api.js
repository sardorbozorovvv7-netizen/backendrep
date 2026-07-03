const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const {
  validateRegister,
  validateProduct,
  validateCategory,
  validateCart,
  validateCartQty
} = require('../middleware/validation');

// ==========================================
// AUTH & USERS ROUTES
// ==========================================
router.get('/auth/current', shopController.currentAuth);
router.post('/auth/register-user', validateRegister, shopController.registerUser);
router.get('/managers', shopController.getManagers);
router.post('/managers', shopController.createManager);
router.delete('/managers/:id', shopController.deleteManager);
router.get('/users', shopController.getUsers);

// ==========================================
// CATEGORIES ROUTES
// ==========================================
router.get('/categories', shopController.getCategories);
router.post('/categories', validateCategory, shopController.createCategory);
router.delete('/categories/:id', shopController.deleteCategory);

// ==========================================
// PRODUCTS ROUTES
// ==========================================
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProductById);
router.post('/products', validateProduct, shopController.createProduct);
router.put('/products/:id', validateProduct, shopController.updateProduct);
router.delete('/products/:id', shopController.deleteProduct);
router.post('/products/:id/like', shopController.toggleLike);
router.get('/likes', shopController.getLikes);

// ==========================================
// CART ROUTES
// ==========================================
router.get('/cart', shopController.getCart);
router.post('/cart', validateCart, shopController.addToCart);
router.put('/cart/:id', validateCartQty, shopController.updateCartQty);
router.delete('/cart/:id', shopController.removeFromCart);

// ==========================================
// ORDER / HISTORYMODEL ROUTES
// ==========================================
router.get('/orders', shopController.getOrders);
router.post('/orders/checkout', shopController.checkout);
router.post('/orders/guest-checkout', shopController.guestCheckout);

module.exports = router;
