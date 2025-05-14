const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  node_name: String,
  ethereum_rpc: String,
  beacon_rpc: String,
  private_key: String,
  wallet_address: String,
  vps_ip: String,
  block_number: String,
  proof_string: String,
  status: { type: String, default: 'active' },
  base_start_command: String, // New field for the dynamically generated command
}, { timestamps: true });

module.exports = mongoose.model('NodeData', NodeSchema);