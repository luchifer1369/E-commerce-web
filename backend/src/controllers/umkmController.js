const Umkm = require('../models/Umkm');
const axios = require('axios');

// @desc    Register new UMKM
// @route   POST /api/umkm
// @access  Private (Owner)
exports.registerUmkm = async (req, res) => {
    try {
        const { name, description, category, address, phone, openHours, paymentMethods, deliveryAvailable, pickupAvailable } = req.body;

        // Gunakan Google Geocoding API untuk konversi alamat ke latitude/longitude
        // Pastikan GOOGLE_API_KEY diset di .env
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;
        
        const response = await axios.get(geocodeUrl);
        const data = response.data;

        let coordinates = [0, 0]; // Default [lng, lat]
        
        if (data.status === 'OK' && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            coordinates = [loc.lng, loc.lat]; // GeoJSON format: [longitude, latitude]
        } else {
             // Jika environment testing/tidak ada API key, biarkan default atau kirim error
             console.warn('Geocoding failed or no API key, using default coordinates [0,0]');
        }

        const umkm = await Umkm.create({
            owner: req.user._id,
            name,
            description,
            category,
            address,
            phone,
            openHours,
            paymentMethods,
            deliveryAvailable,
            pickupAvailable,
            location: {
                type: 'Point',
                coordinates
            }
        });

        res.status(201).json(umkm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get nearby UMKM
// @route   GET /api/umkm/nearby?lat=&lng=&radius=
// @access  Public
exports.getNearbyUmkm = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Please provide lat and lng' });
        }

        // Radius default 5000 meter (5km)
        const radiusInMeters = radius ? parseInt(radius) : 5000;

        const umkms = await Umkm.find({
            status: 'active', // Hanya tampilkan UMKM yang sudah di-approve
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }).populate('category', 'name icon');

        res.status(200).json({
            count: umkms.length,
            data: umkms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single UMKM detail
// @route   GET /api/umkm/:id
// @access  Public
exports.getUmkmById = async (req, res) => {
    try {
        const umkm = await Umkm.findById(req.params.id)
            .populate('category', 'name icon')
            .populate('owner', 'name email');

        if (!umkm) {
            return res.status(404).json({ message: 'UMKM not found' });
        }

        res.status(200).json(umkm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
