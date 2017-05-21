'use strict';

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const paginate = require('express-paginate');
const express = require('express');
const app = express();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'MY_VERY_SECRET_SECRET',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google'),
    function(req, res) {
        res.redirect('/');
    });

app.use(paginate.middleware(10, 50));
app.use('/videos', require('./routes/videos'));
app.use('/comments', require('./routes/comments'));
app.use('/users', require('./routes/users'));

app.listen(3000);
