// controllers/reportController.js
const Report = require("../models/report");
const Transaction = require("../models/Transaction");

//  Generate and Save Report 
exports.generateReport = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.body;
    const filter = {};

    if (status && status !== "ALL") filter.status = status;
    if (startDate && endDate)
      filter.issueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    // If user is not admin, show only their own transactions
    if (!req.user.isAdmin) {
      filter.user = req.user._id;
    }

    const transactions = await Transaction.find(filter)
      .populate("book user", "title author name")
      .lean();

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({
      success: false,
      message: "Server error while generating report",
    });
  }
};

// Get Report Data (GET)
exports.getReports = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const filter = {};
    if (status && status !== "ALL") filter.status = status;
    if (startDate && endDate)
      filter.issueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.find(filter)
      .populate("book user")
      .sort({ issueDate: -1 })
      .lean();

    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching reports" });
  }
};
