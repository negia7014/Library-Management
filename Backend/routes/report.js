// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { protect, verifyRole } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Generate report (save record)
router.post("/generate", protect, verifyRole(["admin","user"]), reportController.generateReport);

// Fetch reports (for table display)
router.get("/reports", protect, verifyRole(["admin"]), reportController.getReports);

module.exports = router;
