const router = require('express').Router();

const passport = require('../middlewares/authentication');
const Channel = require('../models/channel');

// @Route GET /api/channel
router.get('/', passport.isLoggedIn(), (req, res) => {
  Channel.find({}, (findErr, findRes) => {
    if (findErr) res.status(500).send(findErr);
    res.json(findRes);
  })
});

// @Route POST /api/channel
router.post('/', passport.isLoggedIn(), (req, res) => {
  Channel.create({ name: req.body.name, messages: [] }, (error, result) => {
    if(error) res.status(500).send(error);
    res.json({ success: true })
  });
})

module.exports = router;