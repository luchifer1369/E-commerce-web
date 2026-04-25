const express = require('express');
const router = express.Router();
const { createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { parser } = require('../config/cloudinary');

// Rute umum produk
router.route('/')
    .post(protect, authorize('owner'), parser.array('images', 5), createProduct); // Maksimal upload 5 foto sekaligus

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('owner'), parser.array('images', 5), updateProduct)
    .delete(protect, authorize('owner'), deleteProduct);

module.exports = router;
