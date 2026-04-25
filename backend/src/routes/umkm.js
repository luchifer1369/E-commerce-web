const express = require('express');
const router = express.Router();
const { registerUmkm, getNearbyUmkm, getUmkmById } = require('../controllers/umkmController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/nearby', getNearbyUmkm);
router.get('/:id', getUmkmById);
// Hanya user dengan role 'owner' yang bisa mendaftarkan UMKM
router.post('/', protect, authorize('owner'), registerUmkm);

module.exports = router;
