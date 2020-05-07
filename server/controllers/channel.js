const router = require('express').Router();

const passport = require('../middlewares/authentication');
const Channel = require('../models/channel');
const User = require('../models/user');

// @Route GET /api/channel
router.get('/', passport.isLoggedIn(), (req, res) => {
  Channel.find({}, (findErr, findRes) => {
    if (findErr) res.status(500).send(findErr);
    res.json(findRes);
  })
});

// @Route POST /api/channel
router.post('/', passport.isLoggedIn(), (req, res) => {
  Channel.create({ name: req.body.name, type: req.body.type, messages: [] }, (error, result) => {
    if(error) res.status(500).send(error);
    res.json({ success: true })
  });
})

// @Route PUT /api/channel/join-voice
router.put('/join-voice', passport.isLoggedIn(), (req, res) => {
  const socketId = req.body.socketId;
  const currentVoiceChannel = req.body.channelName;

  Channel.findOne({ name: req.body.channelName }, (error, result) => {
    if(error) res.status(500).send(error);
    result.set(`talkers.${socketId}`, req.user);
    result.save( (error, result) => {
      if(error) res.status(500).send(error);
      console.log(currentVoiceChannel);
      User.updateOne({ email: req.user.email }, { currentVoiceChannel }, (error, result) => {
        if(error) res.status(500).send(error);
        res.json(result);
      })
    })
  })
})

module.exports = router;