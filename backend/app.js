const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const logger = require('morgan');
const debug = require('debug');
const cors = require('cors');
// const csurf = require('csurf');
const { isProduction } = require('./config/keys');
require('./models/user')
require('./config/passport'); 
const passport = require('passport'); 
// Express Routers
const usersRouter = require('./routes/api/users');
const csrfRouter = require('./routes/api/csrf');
const imageRouter = require('./routes/api/images')
const app = express();
const { MONGODB_URI} = process.env;

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// if (isProduction) {
//     app.use(cors());
// }


app.use(cors({
    origin: "*",
}));

// app.use(
//     csurf({
//         cookie: {
//         secure: isProduction,
//         sameSite: isProduction && "Lax",
//         httpOnly: true
//         }
//     })
// );

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/image',imageRouter)
app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));
app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);
app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});
const serverErrorLogger = debug('backend:error');
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});
module.exports = app;
