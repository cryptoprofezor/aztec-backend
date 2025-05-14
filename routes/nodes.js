const express = require('express');
const jwt = require('jsonwebtoken');
const Node = require('../models/Node');

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get all nodes
router.get('/nodes', verifyToken, async (req, res) => {
    try {
        const nodes = await Node.find();
        res.status(200).json(nodes);
    } catch (err) {
        console.error('Error fetching nodes:', err);
        res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

// Get node by ID
router.get('/nodes/:id', verifyToken, async (req, res) => {
    try {
        const node = await Node.findById(req.params.id);
        if (!node) return res.status(404).json({ error: 'Node not found' });
        res.status(200).json(node);
    } catch (err) {
        console.error('Error fetching node:', err);
        res.status(500).json({ error: 'Failed to fetch node' });
    }
});

// Create a node
router.post('/nodes', verifyToken, async (req, res) => {
    try {
        const node = new Node(req.body);
        await node.save();
        res.status(201).json(node);
    } catch (err) {
        console.error('Error creating node:', err);
        res.status(500).json({ error: 'Failed to create node' });
    }
});

// Update a node
router.put('/nodes/:id', verifyToken, async (req, res) => {
    try {
        const node = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!node) return res.status(404).json({ error: 'Node not found' });
        res.status(200).json(node);
    } catch (err) {
        console.error('Error updating node:', err);
        res.status(500).json({ error: 'Failed to update node' });
    }
});

// Delete a node
router.delete('/nodes/:id', verifyToken, async (req, res) => {
    try {
        const node = await Node.findByIdAndDelete(req.params.id);
        if (!node) return res.status(404).json({ error: 'Node not found' });
        res.status(200).json({ message: 'Node deleted' });
    } catch (err) {
        console.error('Error deleting node:', err);
        res.status(500).json({ error: 'Failed to delete node' });
    }
});

// Get stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const nodes = await Node.find();
        const totalNodes = nodes.length;
        const activeNodes = nodes.filter(node => node.status === 'active').length;
        const uniqueWallets = [...new Set(nodes.map(node => node.wallet_address))].filter(Boolean).length;

        res.status(200).json({
            total_nodes: totalNodes,
            active_nodes: activeNodes,
            unique_wallets: uniqueWallets
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
