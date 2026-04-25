const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    umkm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Umkm',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment text']
    }
}, {
    timestamps: true
});

// Mencegah user memberi lebih dari satu review untuk kombinasi order dan product yang sama
reviewSchema.index({ order: 1, product: 1 }, { unique: true });

// Static method untuk menghitung rata-rata rating
reviewSchema.statics.getAverageRating = async function(productId, umkmId) {
    // 1. Update Product Rating
    const objProduct = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (objProduct.length > 0) {
            await this.model('Product').findByIdAndUpdate(productId, {
                averageRating: Math.round(objProduct[0].averageRating * 10) / 10,
                totalReviews: objProduct[0].totalReviews
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                averageRating: 0,
                totalReviews: 0
            });
        }
    } catch (err) {
        console.error(err);
    }

    // 2. Update UMKM Rating
    const objUmkm = await this.aggregate([
        { $match: { umkm: umkmId } },
        {
            $group: {
                _id: '$umkm',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (objUmkm.length > 0) {
            await this.model('Umkm').findByIdAndUpdate(umkmId, {
                averageRating: Math.round(objUmkm[0].averageRating * 10) / 10,
                totalReviews: objUmkm[0].totalReviews
            });
        } else {
            await this.model('Umkm').findByIdAndUpdate(umkmId, {
                averageRating: 0,
                totalReviews: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Panggil getAverageRating setelah save
reviewSchema.post('save', async function() {
    await this.constructor.getAverageRating(this.product, this.umkm);
});

// Panggil getAverageRating sebelum hapus (menggunakan deleteOne query middleware)
reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
    await this.constructor.getAverageRating(this.product, this.umkm);
});

module.exports = mongoose.model('Review', reviewSchema);
