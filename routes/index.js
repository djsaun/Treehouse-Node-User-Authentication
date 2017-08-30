const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /register - Sign up form
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Register' });
});

// POST /register - to add sign up data to database
router.post('/register', function(req, res, next) {
  if (req.body.email && req.body.name && req.body.favoriteBook && req.body.password && req.body.confirmPassword) {

    // confirm that user typed same password twice
    if (req.body.password !== req.body.confirmPassword) {
      let err = new Error('Passwords do not match!');
      err.status = 400;
      return next(err);
    }

    // create object with form input
    const userData = {
      name: req.body.name,
      email: req.body.email,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    };

    // use schema's 'create' method to insert document into mongo
    User.create(userData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id; // Automatically log in the user after registering
        return res.redirect('/profile');
      }
    });

  } else {
    let err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Login' });
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error | !user) { // If error or no user
        let err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id; // Assigning a value to a req session tells Express to update an existing session or create a new session
        return res.redirect('/profile');
      }
    });
  } else {
    let err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /log-out
router.get('/log-out', function(req, res, next) {
  if (req.session) { // check to see if session exists
    req.session.destroy(function(err) { // if so, destroy the session
      if (err) {
        return next(err);
      } else {
        return res.redirect('/'); // and redirect to the site's homepage
      }
    });
  }
});

// Get /profile

router.get('/profile', function(req, res, next) {
  if (!req.session.userId) { // Check if session user id exists, if not, don't allow access to page and throw error
    let err = new Error("You must be logged in to view this page.");
    err.status = 403;
    return next(err);
  }

  User.findById(req.session.userId)  // If session user id exists, find the user by the user id stored in the session
      .exec(function(error, user) {
        if (error) {
          return next(error);
        } else { // render profile page pulling in name and favorite book values
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

module.exports = router;
