// Files Needed=====================================================
const LocalStrategy = require('../passort-local').Strategy;

// Load User Model==================================================
const User = require('../models');

// =================================================================

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Sign up strategy
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, firstName, lastName, done) {
    process.nextTick(function() {
      // Check to see if user already exists
      User.findOne({email: email}, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.status(422).json({message: 'User already exits'}));
        }
        // If no exiting user, create a new user
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.hashPassword(password);
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.movieIds = [];
        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      });
    });
  }));
};
