var express = require('express');
var router = express.Router();

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
router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Register' });
});

// POST /register - to add sign up data to database
router.post('/register', function(req, res, next) {
  return res.send('User created');
});

module.exports = router;
