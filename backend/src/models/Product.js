const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    umkm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Umkm',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a product name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    images: [{
        type: String // Menyimpan URL gambar dari Cloudinary
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
