const router = require('express').Router();
const mongoose = require('mongoose');

const passport = require('../middlewares/authentication');
const Message = require('../models/message');
const Text = require('../models/text');

//@Route - GET /api/message
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const selectedChannel = req.query.selectedChannel; 
  Message.find({ selectedChannel })
    .populate('sender')
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec((error, result) => {
      if (error) res.status(500).send(error);
      result.sort((a, b) => a.createdAt - b.createdAt);
      res.json(result);
    });
});


//@Route - POST /api/message
router.post('/', passport.isLoggedIn(), (req, res) => {
  const { content, createdAt, selectedChannel } = req.body;

  const newMessage = new Message({
    selectedChannel,
    content, 
    createdAt,
    sender: new mongoose.Types.ObjectId(req.user._id), 
  });

  newMessage.save(null, (err, product) => {
    if (err) res.status(500).send(err);
    res.json(product);
  });
})


module.exports = router;