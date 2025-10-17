const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const maint = require('../controllers/maintenanceController');


router.post('/book', protect, adminOnly, maint.addBook);
router.get(`/book/:id`, protect, adminOnly, maint.getBookBYId)
router.put('/book/:id', protect, adminOnly, maint.updateBook);
router.post('/membership', protect, adminOnly, maint.addMembership);
router.get('/membership/:id', protect,adminOnly, maint.getMembershipById);
router.put('/membership/:id', protect, adminOnly, maint.updateMembership);
router.post('/user', protect, adminOnly, maint.addNewUser);
router.get('/user/:id',protect,adminOnly, maint.ExistingUserById);
router.put('/user/:id',protect, adminOnly, maint.updateExistingUser);

module.exports = router;