# Panduan Eksekusi Tahap 5: Order System

Dokumen ini berisi instruksi teknis mendetail untuk menyelesaikan **Tahap 5: Order System**. AI eksekutor bisa menggunakan ini sebagai acuan langkah demi langkah.

## Langkah-langkah Eksekusi

### 1. Buat Model `Order.js`
**Tugas:** Membuat schema database Mongoose untuk Order/Pesanan. Perhatikan bahwa kita menyimpan snapshot data produk (nama, harga) agar history pesanan tidak berubah jika harga produk diubah di masa depan.
**File yang perlu dibuat (`backend/src/models/Order.js`):**
```javascript
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true }, // Snapshot nama produk
    price: { type: Number, required: true }, // Snapshot harga produk
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    umkm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Umkm',
        required: true
    },
    items: [orderItemSchema],
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },
    deliveryAddress: {
        type: String,
        // Alamat wajib diisi jika metode pengiriman adalah delivery
        required: function() { return this.deliveryMethod === 'delivery'; }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'transfer'],
        required: true
    },
    paymentProof: {
        type: String // URL foto bukti transfer dari Cloudinary (opsional)
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'on_delivery', 'ready_pickup', 'done', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
```

### 2. Buat Controller Pesanan (`orderController.js`)
**Tugas:** Menambahkan logika pemesanan, melihat riwayat, pesanan masuk, dan mengubah status pesanan. Stok produk akan otomatis dikurangi jika status menjadi `confirmed`.
**File yang perlu dibuat (`backend/src/controllers/orderController.js`):**
```javascript
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
```

### 3. Buat Routes Pesanan (`orders.js`)
**Tugas:** Mendaftarkan API endpoint untuk pesanan, memanfaatkan middleware Cloudinary untuk unggah bukti pembayaran jika `paymentMethod` = transfer.
**File yang perlu dibuat (`backend/src/routes/orders.js`):**
```javascript
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
```

### 4. Daftarkan Routes di `app.js`
**Tugas:** Menyambungkan routes `orders` ke server Express.
**File yang perlu diubah (`backend/src/app.js`):**
```javascript
// Tambahkan baris ini di bagian import file rute
const orderRoutes = require('./routes/orders');

// Mount routes (tambahkan di bawah app.use rute-rute lainnya)
app.use('/api/orders', orderRoutes);
```

### 5. Uji Coba Akhir
**Tugas:** Uji menggunakan Postman.
1. Login sebagai `buyer`. POST ke `/api/orders` dengan format JSON/Form-Data untuk membuat pesanan ke UMKM tertentu. Pastikan item pesanan cocok dengan produk yang ada.
2. Cek `/api/orders/my` sebagai `buyer` untuk memastikan pesanan tercatat.
3. Login sebagai `owner` UMKM yang bersangkutan.
4. GET `/api/orders/incoming` untuk melihat pesanan yang masuk.
5. PATCH `/api/orders/:id/status` dengan data `{ "status": "confirmed" }`.
6. Pastikan secara ajaib stok produk di database berkurang (cek GET detail produk bersangkutan).
