const mongoose = require('mongoose');

const voiceSchema = mongoose.Schema({
  name: String,
  talkers: { type: Map, of: String }
});

module.exports = mongoose.model('voices', voiceSchema);