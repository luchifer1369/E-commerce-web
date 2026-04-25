const express = require('express');
const router = express.Router();
const { updateUmkmStatus, deleteReview, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Terapkan middleware protect dan authorize('admin') untuk semua route di file ini
router.use(protect);
router.use(authorize('admin'));

router.patch('/umkm/:id/status', updateUmkmStatus);
router.delete('/reviews/:id', deleteReview);
router.get('/stats', getStats);

module.exports = router;
