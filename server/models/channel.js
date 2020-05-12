const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  name: String,
  messages: [{ ref: 'msgs', type: mongoose.Schema.Types.ObjectId }],
  type: String,
  talkers: { type: Map, of: String }
});

module.exports = mongoose.model('channels', channelSchema);