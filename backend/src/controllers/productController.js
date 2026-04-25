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
