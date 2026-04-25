const express = require('express');
const router = express.Router();
const { registerUmkm, getNearbyUmkm, getUmkmById } = require('../controllers/umkmController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const { getUmkmProducts } = require('../controllers/productController');

router.get('/nearby', getNearbyUmkm);
router.get('/:id/products', getUmkmProducts);
router.get('/:id', getUmkmById);
// Hanya user dengan role 'owner' yang bisa mendaftarkan UMKM
router.post('/', protect, authorize('owner'), registerUmkm);

module.exports = router;
