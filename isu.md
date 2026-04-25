# Panduan Eksekusi Tahap 4: Produk

Dokumen ini berisi instruksi teknis mendetail untuk menyelesaikan **Tahap 4: Produk**. AI eksekutor bisa menggunakan ini sebagai acuan langkah demi langkah.

## Langkah-langkah Eksekusi

### 1. Instalasi Library Cloudinary & Multer
**Tugas:** Menginstal modul yang diperlukan untuk menangani upload gambar dan integrasi dengan Cloudinary.
**Perintah Terminal (di dalam folder `backend`):**
```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

### 2. Setup Konfigurasi Cloudinary
**Tugas:** Membuat file konfigurasi untuk menghubungkan backend ke Cloudinary.
**File yang perlu dibuat (`backend/src/config/cloudinary.js`):**
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi menggunakan environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'umkm_ecommerce/products',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const parser = multer({ storage: storage });

module.exports = { cloudinary, parser };
```

### 3. Buat Model `Product.js`
**Tugas:** Membuat schema database Mongoose untuk Produk.
**File yang perlu dibuat (`backend/src/models/Product.js`):**
```javascript
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
```

### 4. Buat Controller Produk (`productController.js`)
**Tugas:** Menambahkan logika CRUD produk.
**File yang perlu dibuat (`backend/src/controllers/productController.js`):**
```javascript
const Product = require('../models/Product');
const Umkm = require('../models/Umkm');

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Owner)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        
        // Cari UMKM milik owner ini
        const umkm = await Umkm.findOne({ owner: req.user._id });
        if (!umkm) {
            return res.status(404).json({ message: 'Umkm profile not found for this user' });
        }

        // Kumpulkan URL gambar hasil upload multer dari req.files
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        }

        const product = await Product.create({
            umkm: umkm._id,
            name,
            description,
            price,
            stock,
            images
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all products for a specific UMKM
// @route   GET /api/umkm/:id/products
// @access  Public
exports.getUmkmProducts = async (req, res) => {
    try {
        const products = await Product.find({ umkm: req.params.id, isActive: true });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('umkm', 'name address location phone');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner)
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id).populate('umkm');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verifikasi bahwa user yang sedang login adalah pemilik UMKM ini
        if (product.umkm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this product' });
        }

        // Update basic fields
        const { name, description, price, stock, isActive } = req.body;
        
        let updateData = { name, description, price, stock, isActive };

        // Jika ada file baru di-upload, tambahkan ke array images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            updateData.images = [...product.images, ...newImages];
        }

        product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('umkm');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.umkm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this product' });
        }

        await product.deleteOne();

        res.status(200).json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
```

### 5. Buat Routes Produk (`products.js`)
**Tugas:** Mendaftarkan API endpoint untuk produk dan menghubungkan middleware Cloudinary `parser` untuk file upload.
**File yang perlu dibuat (`backend/src/routes/products.js`):**
```javascript
const express = require('express');
const router = express.Router();
const { createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { parser } = require('../config/cloudinary');

// Rute umum produk
router.route('/')
    .post(protect, authorize('owner'), parser.array('images', 5), createProduct); // Maksimal upload 5 foto sekaligus

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('owner'), parser.array('images', 5), updateProduct)
    .delete(protect, authorize('owner'), deleteProduct);

module.exports = router;
```

### 6. Update Route UMKM untuk Mendapatkan List Produk UMKM
**Tugas:** Menambahkan rute `/api/umkm/:id/products` agar publik dapat melihat semua produk yang dijual sebuah UMKM.
**File yang perlu diubah (`backend/src/routes/umkm.js`):**
```javascript
// Tambahkan baris-baris ini di dalam file backend/src/routes/umkm.js

// Import controller yang dibutuhkan (getUmkmProducts diambil dari productController)
const { getUmkmProducts } = require('../controllers/productController');

// Tambahkan rute baru ini SEBELUM rute router.get('/:id', ...)
router.get('/:id/products', getUmkmProducts);
```

### 7. Daftarkan Routes di `app.js`
**Tugas:** Menyambungkan routes `products` ke server Express.
**File yang perlu diubah (`backend/src/app.js`):**
```javascript
// Tambahkan di bagian import routes
const productRoutes = require('./routes/products');

// Mount routes (tambahkan di bawah routes auth & umkm)
app.use('/api/products', productRoutes);
```

### 8. Uji Coba Akhir
**Tugas:** Uji menggunakan Postman.
- **POST `/api/products`**: Kirim *form-data*, isi teks (`name`, `price`, `stock`, `description`) dan tambahkan tipe file ke `images`. Token harus milik *owner*. Pastikan UMKM untuk owner ini sudah ada.
- **GET `/api/umkm/:id/products`**: Ambil ID UMKM dan pastikan semua produknya muncul.
- **GET `/api/products/:id`**: Pastikan detail produk + info UMKM-nya muncul.
- **PUT / DELETE `/api/products/:id`**: Pastikan hanya *owner* dari produk tersebut yang dapat mengubah atau menghapusnya.
