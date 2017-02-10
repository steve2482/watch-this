require('dotenv').config();
module.exports = function(app, passport) {
	// Home page
  app.get('/', function(req, res) {
    res.render('pages/index', {
      env: {
        ENVIRONMENT: process.env.ENVIRONMENT
      }
    });
  });

	// Login
  app.get('/login', function(req, res) {
    res.render('pages/login');
  });

  // Sign Up
  app.get('/sign-up', function(req, res) {
    res.render('pages/sign-up');
  });

  // Process the sign up form
  // app.post('/signup', function(req, res) {
  // });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/sign-up', passport.authenticate('local-signup', {
    successRedirect: 'pages/user-home',
    failureRedirect: 'pages/sign-up'
  }));
};

// Make sure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
