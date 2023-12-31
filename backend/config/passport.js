const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('./keys');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secretOrKey;

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload._id)
    if (user) {
      // return the user to the frontend
      return done(null, user);
    }
    // return false since there is no user
    return done(null, false);
  }
  catch(err) {
    done(err);
  }
}));

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5050/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
exports.requireUser = passport.authenticate('jwt', { session: false });
exports.restoreUser = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, function(err, user) {
      if (err) return next(err);
      if (user) req.user = user;
      next();
    })(req, res, next);
  };
passport.use(new LocalStrategy({
    session: false,
    usernameField: 'username',
    passwordField: 'password',
  }, async function (username, password, done) {
    const user = await User.findOne({ username });
    if (user) {
      bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
        if (err || !isMatch) done(null, false);
        else done(null, user);
      });
    } else
      done(null, false);
  }));
exports.loginUser = async function(user) {
    const userInfo = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName
    };
    const token = await jwt.sign(
      userInfo, // payload
      secretOrKey, // sign with secret key
      { expiresIn: 3600 } // tell the key to expire in one hour
    );
    return {
      user: userInfo,
      token
    };
  };