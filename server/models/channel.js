const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  name: String,
  messages: [{ ref: 'msgs', type: mongoose.Schema.Types.ObjectId }],
  type: String,
  talkers: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('channels', channelSchema);