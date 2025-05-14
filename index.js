require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting app...');
console.log('Environment variables:', {
    HARDCODED_USERNAME: process.env.HARDCODED_USERNAME,
    HARDCODED_PASSWORD_HASH: process.env.HARDCODED_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

try {
    console.log('Loading routes...');
    const authRoutes = require('./routes/auth');
    const nodeRoutes = require('./routes/nodes');

    console.log('Setting up middleware...');
    app.use(cors({
        origin: ['http://localhost:8080', 'https://aztec-node.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express.json());

    console.log('Registering routes...');
    app.use('/api/auth', authRoutes); // Mounts auth routes under /api/auth
    app.use('/api', nodeRoutes);      // Mounts node routes under /api

    app.get('/', (req, res) => {
        console.log('Root route accessed');
        res.status(200).json({ message: 'Welcome to Aztec Node Manager Backend' });
    });

    app.get('/health', (req, res) => {
        console.log('Health check request received');
        res.status(200).json({ status: 'OK', message: 'Server is running' });
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    console.log('Starting server...');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
} catch (err) {
    console.error('Startup error:', err.message || err);
    process.exit(1);
}