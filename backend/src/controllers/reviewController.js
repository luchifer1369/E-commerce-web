const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Buyer)
exports.addReview = async (req, res) => {
    try {
        const { orderId, productId, rating, comment } = req.body;

        // Validasi Order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Pastikan pembeli ini yang memiliki order
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to review this order' });
        }

        // Pastikan status order sudah selesai (done)
        if (order.status !== 'done') {
            return res.status(400).json({ message: 'Can only review completed (done) orders' });
        }

        // Pastikan produk yang di-review ada di dalam order items
        const itemExists = order.items.find(item => item.product.toString() === productId);
        if (!itemExists) {
            return res.status(400).json({ message: 'Product not part of this order' });
        }

        // Cek apakah sudah pernah di-review sebelumnya untuk order dan produk yang sama
        const alreadyReviewed = await Review.findOne({ order: orderId, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product in this order' });
        }

        // Buat review baru
        const review = await Review.create({
            product: productId,
            umkm: order.umkm,
            buyer: req.user._id,
            order: orderId,
            rating: Number(rating),
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('buyer', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
