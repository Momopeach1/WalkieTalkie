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
  Whiteboard.find({}, (findErr, findRes) => {
    if (findErr) res.status(500).send(findErr);
    res.json(findRes);
  });
});


module.exports = router;