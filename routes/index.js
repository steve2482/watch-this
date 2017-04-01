const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

// Get Homepage========================================================
// ====================================================================
router.get('/', ensureAuthenticated, function(req, res) {
  let isLoggedIn = !!req.user;
  res.render('index', {loggedIn: isLoggedIn});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

// Check to see if a user is logged in=================================
// ====================================================================
router.get('/logged-in', function(req, res) {
  let isLoggedIn = !!req.user;
  res.send({loggedIn: isLoggedIn});
});

module.exports = router;
