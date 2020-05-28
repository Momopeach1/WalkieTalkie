const router = require('express').Router();
const url = require('url');

const passport = require('../middlewares/authentication');
const User = require('../models/user');

// @Route GET /api/user/check
router.get('/check', passport.isLoggedIn(), (req, res) => {
  res.json(req.user);
});

// @Route GET /api/user
router.get('/', (req, res, next) => {
  User.find({}, (findErr, findRes) => {
    if (findErr) next(findErr);

    res.json(findRes);
  })
});

// @Route PUT /api/user
router.put('/', passport.isLoggedIn(), (req, res, next) => {
  const query = { email: req.body.email };
  const update = { ...req.body };

  User.updateOne(query, update, (updateErr, updateRes) => {
    if (updateErr) next(updateErr);
    res.json(updateRes);
  })
})

// @Route PUT /api/user/change-password
router.put('/change-password', (req, res) => {
  User.findOne({ email: req.body.email}, (error, result) => {
    if (error) return res.status(500).send(error);
    
    result.password = req.body.password;
    
    result.save((error, result) => {
      if (error) return res.status(500).send(error);

      res.json(result);
    })
  })
})

// @Route POST /api/user/signup
router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) return res.status(422).send({ error: 'Email is in use!' });

    const newUser = new User({
        displayName: req.body.displayName,
        photoURL: 'https://s.pximg.net/common/images/no_profile.png',
        role: 'Member',
        socketId: null,
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
  res.json(req.user);
});

// @Route POST /api/user/signout
router.post('/signout', (req, res) => {
  req.logout();
  res.status(200).json({ message: "ok" });
})

// @Route GET /api/user/oauth/google
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// @Router GET /api/user/oauth/google/callback
router.get('/oauth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log('reached call back');
  const host = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });

  res.redirect(`${host}/chat`);
})

module.exports = router;