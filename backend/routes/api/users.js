const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passport = require('passport');
const { loginUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message:"GET /api/users"
  })
});
router.post('/test', function(req, res, next) {
  res.json({
    message:"POST /api/test"
  })
});
router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    // In development, allow React server to gain access to the CSRF token
    // whenever the current user information is first loaded into the
    // React application
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    firstName: req.user.firstName
  });
});
router.post('/register',validateRegisterInput, async (req, res, next) => {
  const user = await User.findOne({
    username: req.body.username 
  });
  const err = new Error("Validation Error");
  const errors = {};
  if (req.body.password.length < 6) {
    err.statusCode = 400;
    errors.password = "Password is too short. Must be at least 6 characters";
    err.errors = errors
  }
  if (user) {
    err.statusCode = 400;
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
  }
  if(Object.values(err).length > 0){
    return next(err);
  }
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user));
      }
      catch(err) {
        next(err);
      }
    })
  });
});
router.post('/login',validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if (err) return next(err);
    return res.json({
      message:"Kenny kenny kenny"
    })
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { username: "Invalid credentials" };
      return next(err);
    }
    
    return res.status(200).json(await loginUser(user));
  })(req, res, next);
});

module.exports = router;
