const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message:"GET /api/users"
  })
});
router.post('/register', async (req, res, next) => {
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
        return res.json({user})
        // return res.json(await loginUser(user));
      }
      catch(err) {
        next(err);
      }
    })
  });
});

module.exports = router;
