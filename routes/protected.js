const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

router.get('/protected', isAuthenticated, (req, res) => {
  res.render('protected', { user: req.user });
});

module.exports = router;