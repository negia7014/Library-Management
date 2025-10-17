
const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');

// ✅ Import middleware
const { protect, verifyRole } = require('../middleware/auth');

// Routes
router.post("/issue", protect, verifyRole(["admin", "user"]), transaction.issueBook);
router.post("/return", protect, verifyRole(["admin", "user"]), transaction.returnBook);

router.get("/history", protect, verifyRole(["admin"]), transaction.viewTransactions);

module.exports = router;
