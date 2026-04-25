const mongoose = require('mongoose');

const umkmSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add UMKM name']
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true
        }
    },
    address: {
        type: String,
        required: [true, 'Please add address']
    },
    photos: [{
        type: String // URL Cloudinary
    }],
    openHours: {
        type: String // Contoh: "08.00-17.00"
    },
    phone: {
        type: String,
        required: [true, 'Please add phone number']
    },
    paymentMethods: [{
        type: String,
        enum: ['cod', 'transfer']
    }],
    deliveryAvailable: {
        type: Boolean,
        default: false
    },
    pickupAvailable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending'
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

// Index untuk query geospasial
umkmSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Umkm', umkmSchema);
