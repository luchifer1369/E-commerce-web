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
