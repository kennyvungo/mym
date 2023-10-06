const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('user');
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