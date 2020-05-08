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

  Channel.findOne({ name: currentVoiceChannel }, (error, result) => {
    if(error) res.status(500).send(error);
    if (req.user.currentVoiceChannel === currentVoiceChannel) return res.status(409).send("You're already in this voice channel!");
    result.set(`talkers.${socketId}`, JSON.stringify(req.user)); //this needs to be in string format 
    result.save( (error, result) => {
      if (error) res.status(500).send(error);

      User.findOne({ email: req.user.email }, (error, result) => {
        if(error) res.status(500).send(error);
        Channel.findOne({ name: result.currentVoiceChannel }, (error, result) => {
          if (error) return res.status(500).send(error);
          if (!result) return;

          result.talkers.delete(socketId);
          result.save();
        });
        User.updateOne({ email: req.user.email }, { currentVoiceChannel }, (error, result) => {})
      })
      res.json(result);
    })
  })
})

module.exports = router;