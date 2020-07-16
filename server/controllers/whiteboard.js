const router = require('express').Router();

const passport = require('../middlewares/authentication');
const Whiteboard = require('../models/whiteboard');

// @Route - POST /api/whiteboard
router.post('/', passport.isLoggedIn(), (req, res) => {
  Whiteboard.create({ name: req.body.name, artists: [] }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json(result);
  });
});

// @Route - GET /api/whiteboard
router.get('/', passport.isLoggedIn(), (req, res) => {
  Whiteboard.find({}).populate('artists').exec((findErr, findRes) => {
    if (findErr) return res.status(500).send(findErr);
    res.json(findRes);   
  });
});

// @Route - PUT /api/whiteboard/join
router.put('/join', passport.isLoggedIn(), (req, res) => {
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    if (finderr) return res.status(500).send(finderr);
    if (findres.artists.find(a => a.equals(req.user._id))) return res.status(500).send("Cannot join whiteboard.");
    findres.artists.push(req.user);
    findres.save((error, result) => {
      if(error) return res.status(500).send(error);
      res.send("User added to whiteboard");
    });
  });
});

// @Route - PUT /api/whiteboard/save
router.put('/save', (req, res) => {
  Whiteboard.findOne({ name: req.body.name }, (finderr, findres) => {
    if(finderr) return res.status(500).send(finderr);
    findres.img = req.body.dataURL;
    findres.bgColor = req.body.bgColor;
    findres.save((saveErr, saveRes) => {
      if(saveErr) return res.status(500).send(saveErr);
      res.send("canvas saved");
    });
  });
});

// @Route - GET /api/whiteboard/load
router.get('/load', passport.isLoggedIn(), (req, res) => {
  Whiteboard.findOne({ name: req.query.name }).populate('artists').exec((finderr, findres) => {
    if(finderr) return res.status(500).send(finderr);
    // res.json({ img: findres.img });
    res.json(findres);
  });
});

// @Route - DELETE /api/whiteboard/leave
router.delete('/leave', passport.isLoggedIn(), (req, res) => {
  console.log('called leave whiteboard')
  console.log('leaving room: ', req.body.name)
  console.log('background color:', req.body.bgColor);
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    if (finderr) return res.status(500).send(finderr.errmsg);
    findres.artists = findres.artists.filter(a=> JSON.stringify(a._id) !== JSON.stringify(req.user._id));
    console.log('user id', req.user._id);
    console.log('artists', findres.artists);
    if (findres.artists.length === 0) {
      findres.img = req.body.dataURL;
      findres.bgColor = req.body.bgColor;
    }

    findres.save((saveErr, saveRes) => {
      if(saveErr) return res.status(500).send(saveErr.errmsg);
      res.send("User removed from whiteboard");
      console.log('successfully left whiteboard');
      // Call socket to send 'leave whiteboard' to everyone.
    });
  });
});


module.exports = router;