const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }) // setup query to find document with user's email address
      .exec(function(error, user) { // use exec method to perform the search and provide a callback to process the results
        if (error) {
          return callback(error); // If error with the query, return the error
        } else if (!user) {
          let err = new Error('User not found.');
          err.status = 401;
          return callback(err); // Return an error with the email address isn't in any document
        }

        bcrypt.compare(password, user.password, function (error, result) { // use bcrypt's compare method to compare supplied password with the hashed version of the password
          if (result === true) { // if passwords match
            return callback(null, user); // null represents an error value
          } else {
            return callback();
          }
        });
      })
}

// use mongoose pre-save hook to hash password
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash; // overwrite plain text password with hashed password
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
