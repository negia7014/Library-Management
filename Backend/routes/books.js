const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllBooks ,checkBookAvailability} = require('../controllers/bookController');


router.get('/getBooks', getAllBooks);
router.get('/checkAvailable', checkBookAvailability)


module.exports = router;

