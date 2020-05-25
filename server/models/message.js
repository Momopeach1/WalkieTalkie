const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: Date,
  sender: { ref: 'users', type: mongoose.Schema.Types.ObjectId },
  channel: { ref: 'texts', type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('msgs', messageSchema);