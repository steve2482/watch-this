const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

// Get Homepage========================================================
// ====================================================================
router.get('/', authenticationMiddleware, function(req, res) {
  let isLoggedIn = !!req.user;
  res.render('index', {loggedIn: isLoggedIn});
});

// Check to see if a user is logged in=================================
// ====================================================================
router.get('/logged-in', function(req, res) {
	let isLoggedIn = !!req.user;
  res.send({loggedIn: isLoggedIn});
});

module.exports = router;
