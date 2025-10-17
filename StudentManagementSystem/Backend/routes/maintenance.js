const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const maint = require('../controllers/maintenanceController');


router.post('/book', protect, adminOnly, maint.addBook);
router.put('/book/:id', protect, adminOnly, maint.updateBook);
router.post('/membership', protect, adminOnly, maint.addMembership);
router.put('/membership/:id', protect, adminOnly, maint.updateMembership);
router.post('/user', protect, adminOnly, maint.addUser);


module.exports = router;