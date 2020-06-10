const mongoose = require('mongoose');

const whiteboardSchema = mongoose.Schema({
  name: String,
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  img: { type: String, default: '' }
});

module.exports = mongoose.model('whiteboards', whiteboardSchema);
