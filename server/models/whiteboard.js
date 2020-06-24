const mongoose = require('mongoose');

const whiteboardSchema = mongoose.Schema({
  name: String,
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  img: { type: String, default: '' },
  bgColor: {type: String, default: '#40444b'}
});

module.exports = mongoose.model('whiteboards', whiteboardSchema);
