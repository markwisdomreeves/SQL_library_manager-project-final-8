const express = require('express');
const router = express.Router();

// Redirecting Home route back to /books routes
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;
