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
    if (findErr) res.status(500).send(findErr);
    res.json(findRes);   
  });
});

// @Route - PUT /api/whiteboard/join
router.put('/join', passport.isLoggedIn(), (req, res) => {
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    if(finderr) res.status(500).send(finderr);
    findres.artists.push(req.user);
    findres.save((error, result) => {
      if(error) res.status(500).send(error);
      res.send("User added to whiteboard");
    });
  });
});

// @Route - DELETE /api/whiteboard/leave
router.delete('/leave', passport.isLoggedIn(), (req, res) => {
  console.log('request body', req.body);
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    if(finderr) res.status(500).send(finderr);
    console.log(findres);
    findres.artists = findres.artists.filter(a=> JSON.stringify(a._id) !== JSON.stringify(req.user._id));
    findres.save((saveErr, saveRes) => {
      if(saveErr) res.status(500).send(saveErr);
      res.send("User removed from whiteboard");
    });
  });
});


module.exports = router;