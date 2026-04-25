const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getIncomingOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { parser } = require('../config/cloudinary');

// Rute untuk buyer
router.post('/', protect, authorize('buyer'), parser.single('paymentProof'), createOrder);
router.get('/my', protect, authorize('buyer'), getMyOrders);

// Rute untuk owner UMKM
router.get('/incoming', protect, authorize('owner'), getIncomingOrders);
router.patch('/:id/status', protect, authorize('owner'), updateOrderStatus);

module.exports = router;
