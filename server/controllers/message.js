const router = require('express').Router();
const mongoose = require('mongoose');

const passport = require('../middlewares/authentication');
const Message = require('../models/message');
const Text = require('../models/text');

//@Route - GET /api/message
router.get('/', (req, res) => {
  Message.find({})
    .populate('sender')
    .populate('channel')
    .exec((error, result) => {
      if (error) res.status(500).send(error);
      res.json(result);
    });
});


//@Route - POST /api/message
router.post('/', passport.isLoggedIn(), (req, res) => {
  const { content, createdAt, selectedChannel } = req.body;
  
  Text.findOne({ name: selectedChannel }, (error, result) => {
    if (error){ 
      res.status(500).send(error);
      reject(error);
    }
    
    const newMessage = new Message({ 
      content, 
      createdAt, 
      sender: new mongoose.Types.ObjectId(req.user._id), 
      channel: new mongoose.Types.ObjectId(result.id)
    });
    
    newMessage.save();

    Text.updateOne({ name: selectedChannel }, {messages: [...result.messages, newMessage.id]}, (updateErr, updateRes) => {
      if (updateErr){ 
        res.status(500).send(updateErr);
      }
      
      res.json({ updateRes });
    })
  });
})


module.exports = router;