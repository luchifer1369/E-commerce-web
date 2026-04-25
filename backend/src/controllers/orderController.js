const Order = require('../models/Order');
const Product = require('../models/Product');
const Umkm = require('../models/Umkm');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
exports.createOrder = async (req, res) => {
    try {
        const { umkmId, items, deliveryMethod, deliveryAddress, paymentMethod, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Cek UMKM valid
        const umkm = await Umkm.findById(umkmId);
        if (!umkm) {
            return res.status(404).json({ message: 'UMKM not found' });
        }

        let orderItems = [];
        let totalPrice = 0;

        // Loop melalui item pesanan untuk memvalidasi stok dan mengambil snapshot harga
        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }

            if (product.umkm.toString() !== umkmId) {
                return res.status(400).json({ message: `Product ${product.name} does not belong to the selected UMKM` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }

            const subtotal = product.price * item.quantity;
            totalPrice += subtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: subtotal
            });
        }

        // Ambil bukti pembayaran dari upload multer jika ada
        let paymentProof = null;
        if (req.file) {
            paymentProof = req.file.path;
        }

        // Buat Order
        const order = await Order.create({
            buyer: req.user._id,
            umkm: umkmId,
            items: orderItems,
            deliveryMethod,
            deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
            paymentMethod,
            paymentProof,
            totalPrice,
            notes
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders (Buyer History)
// @route   GET /api/orders/my
// @access  Private (Buyer)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('umkm', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get incoming orders for UMKM (Owner Panel)
// @route   GET /api/orders/incoming
// @access  Private (Owner)
exports.getIncomingOrders = async (req, res) => {
    try {
        // Cari UMKM milik owner yang login
        const umkm = await Umkm.findOne({ owner: req.user._id });
        
        if (!umkm) {
            return res.status(404).json({ message: 'UMKM profile not found for this user' });
        }

        const orders = await Order.find({ umkm: umkm._id })
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Owner)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'preparing', 'on_delivery', 'ready_pickup', 'done', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verifikasi kepemilikan pesanan
        const umkm = await Umkm.findOne({ owner: req.user._id });
        if (!umkm || order.umkm.toString() !== umkm._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this order' });
        }

        // Logika pengurangan stok otomatis jika status berubah dari pending ke confirmed
        if (order.status === 'pending' && status === 'confirmed') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Logika pengembalian stok otomatis jika dibatalkan setelah dikonfirmasi (opsional)
        if (order.status !== 'pending' && order.status !== 'cancelled' && status === 'cancelled') {
             for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
