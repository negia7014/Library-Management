
const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');

//Import middleware
const { protect, verifyRole } = require('../middleware/auth');

// Routes
router.post("/issue",protect, verifyRole(["admin", "user"]), transaction.issueBook);
router.get("/issuedBook", protect, verifyRole(["admin", "user"]), transaction.getIssuedBooks);
router.get("/bookDetails/:id", protect, verifyRole(["admin", "user"]), transaction.getBookDetails);
router.post("/return", protect, verifyRole(["admin", "user"]), transaction.returnBook);



module.exports = router;
