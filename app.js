const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github').Strategy;
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
require('./helpers/init_redis')

const crypto = require('crypto');
const cors = require('cors');

const generateRandomString = () => {
  return crypto.randomBytes(32).toString('hex');
};

const AuthRoute = require('./Routes/Auth.route')
const { refreshToken } = require('./Controllers/Auth.Controller')

const app = express()
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: generateRandomString(),
  resave: false,
  saveUninitialized: true
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  User.findOne({email: email}, (err, user) => {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }
    if(!user.verifyPassword(password)) { return done (null, false); }
    return done(null, user);
  })
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({ githubId: profile.id }, (err, user) => {
    return done(err, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {})

app.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('Hello from express.')
})

app.use('/auth', AuthRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
