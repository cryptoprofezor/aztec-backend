const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request:', { username, password });

        const hardcodedUsername = process.env.HARDCODED_USERNAME || 'adminuser';
        const hardcodedPasswordHash = process.env.HARDCODED_PASSWORD_HASH;

        if (!hardcodedPasswordHash) {
            console.error('HARDCODED_PASSWORD_HASH not set in environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        if (username !== hardcodedUsername) {
            console.log('Invalid username:', username);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, hardcodedPasswordHash);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: 'hardcoded-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated:', token);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err.message || err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;