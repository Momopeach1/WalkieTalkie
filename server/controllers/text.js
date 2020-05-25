const router = require('express').Router();

const passport = require('../middlewares/authentication');
const privilege = require('../middlewares/privilege');
const Text = require('../models/text');
const User = require('../models/user');

// @Route GET /api/text
router.get('/', passport.isLoggedIn(), (req, res) => {
  Text.find({}, (findErr, findRes) => {
    if (findErr) return res.status(500).send(findErr);
    res.json(findRes);
  })
});

// @Route POST /api/text
router.post('/', passport.isLoggedIn(), (req, res) => {
  Text.create({ name: req.body.name, messages: [] }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json({ success: true })
  });
});

module.exports = router;