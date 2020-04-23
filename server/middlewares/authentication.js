const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);

      user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (!isMatch) return done(null, false);

          return done(null, user);
      });
  })
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/user/oauth/google/callback"
  }, (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) return done(err, null);
        if (!user) return done(null, false);

        return done(null, user);
    });
});

passport.isLoggedIn = () => (req, res, next) => (req.user? next() : res.sendStatus(401));



module.exports = passport;