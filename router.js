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

  app.post('/sign-up', passport.authenticate('local-signup', {
    successRedirect: 'pages/user-home',
    failureRedirect: '/'
  }));

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

  // Make sure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
