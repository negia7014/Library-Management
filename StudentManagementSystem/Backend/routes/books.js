const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { searchBooks } = require('../controllers/bookController');


router.get('/search', protect, searchBooks);


module.exports = router;