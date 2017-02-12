require('dotenv').config();
module.exports = function(app, passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
  app.get('/', function(req, res) {
    // load the index.ejs file
    res.render('pages/index.ejs', {
      env: {
        ENVIRONMENT: process.env.ENVIRONMENT
      }
    });
  });

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
  app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
    res.render('pages/login.ejs');
  });

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
  app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
    res.render('pages/sign-up.ejs', {
      env: {
        ENVIRONMENT: process.env.ENVIRONMENT
      }
    });
  });

	// process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/user-home', // redirect to the user home page
    failureRedirect: '/' // redirect to main page
  }));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

	// =====================================
	// LOGOUT ==============================
	// =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

	// rout middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticate in the sessio,. carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they are not, redirect them to the home page
  res.redirect('/');
}
