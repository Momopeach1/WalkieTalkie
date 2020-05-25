const router = require('express').Router();

const passport = require('../middlewares/authentication');
const privilege = require('../middlewares/privilege');
const Channel = require('../models/channel');
const User = require('../models/user');
const Voice = require('../models/voice');

// @Route GET /api/voice
router.get('/', passport.isLoggedIn(), (req, res) => {
  Voice.find({}, (findErr, findRes) => {
    if (findErr) res.status(500).send(findErr);
    res.json(findRes);
  })
});

// @Route POST /api/voice
router.post('/', passport.isLoggedIn(), (req, res) => {
  Voice.create({ name: req.body.name }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json({ success: true })
  });
})

// @Route PUT /api/voice/join-voice
router.put('/join-voice', passport.isLoggedIn(), (req, res) => {
  const socketId = req.body.socketId;
  const currentVoiceChannel = req.body.channelName;

  Voice.findOne({ name: currentVoiceChannel }, (error, result) => {
    if(error) res.status(500).send(error);
    if (req.user.currentVoiceChannel === currentVoiceChannel) return res.status(409).send("You're already in this voice channel!");
    console.log({ ...req.user });
    result.set(`talkers.${socketId}`, JSON.stringify({ ...req.user._doc, currentVoiceChannel })); //this needs to be in string format 
    result.save( (error, result) => {
      if (error) res.status(500).send(error);

      User.findOne({ email: req.user.email }, (error, result) => {
        if(error) res.status(500).send(error);
        Voice.findOne({ name: result.currentVoiceChannel }, (error, result) => {
          if (error) return res.status(500).send(error);
          if (!result) return;

          result.talkers.delete(socketId);
          result.save();
        });
        User.updateOne({ email: req.user.email }, { currentVoiceChannel }, (error, result) => {
        })
      })
      res.json(result);
    })
  })
})

// @Route PUT /api/voice/leave-voice
router.put('/leave-voice', passport.isLoggedIn(), (req, res) => {
  Voice.findOne({ name: req.body.name }, (error, result) => {
    if (error) return res.status(500).send(error);
    result.talkers.delete(req.body.socketId);
    result.save((error, result) => {
      if (error) return res.status(500).send(error);
      User.findOne({email: req.user.email}, (error, result) => {
        if (error) return res.status(500).send(error);
        User.updateOne({ email: req.user.email }, { currentVoiceChannel: '' }, (error, result) => {
          if (error) return res.status(500).send(error);
          res.json(result);
        })
      })
    });
  })
});

// @Route PUT /api/voice/kick
router.put('/kick', passport.isLoggedIn(), privilege.canKick(), (req, res) => {
  Voice.findOne({ name: req.body.name }, (error, result) => {
    if (error) return res.status(500).send(error);
    result.talkers.delete(req.body.socketId);
    result.save((error, result) => {
      if (error) return res.status(500).send(error);
      User.findOne({ email: req.body.email }, (error, result) => {
        if (error) return res.status(500).send(error);
        User.updateOne({ email: req.body.email }, { currentVoiceChannel: '' }, (error, result) => {
          if (error) return res.status(500).send(error);
          res.json(result);
        })
      })
    })
  })
})

module.exports = router;