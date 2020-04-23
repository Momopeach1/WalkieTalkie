const router = require('express').Router();

const passport = require('../middlewares/authentication');
const User = require('../models/user');

// @Route POST /api/user/signup
router.post('/signup', (req, res) => {
  console.log(User);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) return res.status(422).send({ error: 'Email is in use!' });
    console.log('asdfsdfsdf')
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(err => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });  
})

// @Route POST /api/user/signin
router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json({ success: true });
});

// @Route POST /api/user/signout
router.post('/signout', (req, res) => {
  req.logout();
  res.status(200).json({ message: "ok" });
})

// @Route GET /api/user/oauth/google
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile'] }))

// @Router GET /api/user/oauth/google/callback
router.get('/oauth/google/callback', passport.authenticate('google'), (req, res) => {
  res.json({ message: 'meow' });
})

module.exports = router;