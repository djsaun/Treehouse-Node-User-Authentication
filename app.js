const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // loading and calling module -- lets connect middleware access the express sessions
const app = express();

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/bookworm");
const db = mongoose.connection;
// mongo error handler
db.on('error', console.error.bind(console, 'connection error:'));

// use session for tracking logins
app.use(session({
  secret: 'treehouse loves you', // required - string used to sign the session id cookie
  resave: true, // forces session to be saved in the session store whether or not anything was changed
  saveUninitialized: false, // forces an uninitialized session to be saved in the session store,
  store: new MongoStore({
    mongooseConnection: db // pass mongo connection
  })
}));

// make user ID available in templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId; // If user id is stored in session, currentUser will equal that number, otherwise, currentUser will be undefined
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
