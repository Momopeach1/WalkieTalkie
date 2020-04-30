const router = require('express').Router();

const passport = require('../middlewares/authentication');
const Message = require('../models/message');
const Channel = require('../models/channel');

//@Route - GET /api/message
router.get('/', (req, res) => {
  Message.find({}, (error, result) => {
    if (error) res.status(500).send(error);
    res.json(result);
  })
})


//@Route - POST /api/message
router.post('/', passport.isLoggedIn(), (req, res) => {
  const { content, createdAt, selectedChannel } = req.body;

  const newMessage = new Message({ content, createdAt, sender: new mongoose.Types.ObjectId(req.user._id) });

  var promise1 = new Promise((resolve, reject) => {
      newMessage.save((error, result) => {
        if (error){ 
          res.status(500).send(error);
          reject(error);
        }
        resolve('it works');
      });
  } ) 

  var promise2 = new Promise((resolve, reject) => {
    Channel.findOne({ name: selectedChannel }, (error, result) => {
      if (error){ 
        res.status(500).send(error);
        reject(error);
      }

      Channel.updateOne({ name: selectedChannel }, {messages: [...result.messages, newMessage]}, (updateErr, updateRes) => {
      if (updateErr){ 
        res.status(500).send(updateErr);
        reject(error);
      }

      resolve('works');
      })
    });
  })

  Promise.all([promise1, promise2]).then(() => res.json({succ: true  }))
})

module.exports = router;