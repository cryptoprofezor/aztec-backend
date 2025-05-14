const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ethereum_rpc: { type: String },
    beacon_rpc: { type: String },
    private_key: { type: String },
    wallet_address: { type: String },
    vps_ip: { type: String },
    block_number: { type: String },
    proof_string: { type: String },
    status: { type: String, default: 'active' },
    start_command: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Node', nodeSchema);
