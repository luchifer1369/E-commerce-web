const Umkm = require('../models/Umkm');
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Update UMKM status (Approve/Suspend)
// @route   PATCH /api/admin/umkm/:id/status
// @access  Private (Admin)
exports.updateUmkmStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        // Status yang valid
        const validStatuses = ['pending', 'active', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const umkm = await Umkm.findByIdAndUpdate(
            req.params.id, 
            { status },
            { new: true, runValidators: true }
        );

        if (!umkm) {
            return res.status(404).json({ message: 'UMKM not found' });
        }

        res.status(200).json({
            message: `UMKM status updated to ${status}`,
            data: umkm
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a review (Moderation)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Hapus review. Karena Mongoose middleware (deleteOne) sudah diset di model Review,
        // averageRating di produk & UMKM akan langsung dihitung ulang otomatis!
        await review.deleteOne();

        res.status(200).json({ message: 'Review deleted successfully by admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalUmkm = await Umkm.countDocuments();
        const activeUmkm = await Umkm.countDocuments({ status: 'active' });
        const totalOrders = await Order.countDocuments();

        // Agregasi untuk total pendapatan dari pesanan yang 'done'
        const revenueAggregation = await Order.aggregate([
            { $match: { status: 'done' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        // Agregasi order per bulan (Opsional, sangat bagus untuk chart di frontend)
        const currentYear = new Date().getFullYear();
        const monthlyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                    revenue: { $sum: { $cond: [ { $eq: ["$status", "done"] }, "$totalPrice", 0 ] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            totalUsers,
            totalUmkm,
            activeUmkm,
            totalOrders,
            totalRevenue,
            monthlyOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
