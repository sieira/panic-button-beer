// Load required packages
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new BasicStrategy(function(username, password, callback) {
    // Try to find the logging user
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return callback(err);
      }

      // No user found with that username
      if (!user) {
        // Check if there are users, register him if there aren't
        User.count({}, function(err, count) {
          if(count > 0) {
            // If there are registered users; credentials are wrong
            return callback(null, false);
          } else {
            usr = new User({ username: username, password: password });
            usr.save(function(err) {
              if(err) {
                // error registering user
                return callback(err);
              } else {
                // Success
                return callback(null, user);
              }
            });
          }
        });
      } else {
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
          if (err) { return callback(err); }
          // Password did not match
          if (!isMatch) { return callback(null, false); }
          // Success
          return callback(null, user);
        });
      }
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false});
