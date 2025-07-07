const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  ownerDiscordId: { type: String, required: true },
  containerId: { type: String, required: true },
  ip: { type: String, default: 'localhost' },
  port: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['running', 'stopped'], default: 'running' },
});

module.exports = mongoose.model('Server', serverSchema);
