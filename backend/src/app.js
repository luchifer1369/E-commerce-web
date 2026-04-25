require('dotenv').config({ path: '../.env' }); // menyesuaikan path .env di root backend
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

// Mount routes
app.use('/api/auth', authRoutes);

const umkmRoutes = require('./routes/umkm');

// Mount routes
app.use('/api/umkm', umkmRoutes);

// Basic Health-Check Route
app.get('/', (req, res) => {
    res.json({ message: 'E-Commerce UMKM API is running...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
