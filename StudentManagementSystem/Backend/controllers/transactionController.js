const Book = require("../models/Book");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Helper to calculate fine
const calculateFine = (returnDate, actualReturnDate) => {
  const diffDays = Math.ceil(
    (actualReturnDate - new Date(returnDate)) / (1000 * 60 * 60 * 24)
  );
  return diffDays > 0 ? diffDays * 10 : 0; // ₹10/day fine
};

// ================ ISSUE BOOK =================
exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId, issueDate } = req.body;

    if (!userId || !bookId || !issueDate)
      return res.status(400).json({ message: "Missing required fields" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const returnDate = new Date(issueDate);
    returnDate.setDate(returnDate.getDate() + 15);

    const transaction = await Transaction.create({
      user: userId,
      book: bookId,
      issueDate: new Date(issueDate),
      returnDate,
      status: "issued",
    });

    res.status(201).json({
      message: "Book issued successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================ RETURN BOOK =================
exports.returnBook = async (req, res) => {
  try {
    const { transactionId, actualReturnDate } = req.body;

    const transaction = await Transaction.findById(transactionId)
      .populate("book")
      .populate("user");

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const fine = calculateFine(transaction.returnDate, new Date(actualReturnDate));

    transaction.actualReturnDate = new Date(actualReturnDate);
    transaction.fine = fine;
    transaction.status = "returned";

    await transaction.save();

    res.json({
      message: "Book return initiated. Proceed to pay fine (if any).",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================ PAY FINE =================
exports.payFine = async (req, res) => {
  try {
    const { transactionId, finePaid } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.fine > 0 && !finePaid)
      return res.status(400).json({ message: "Fine must be paid before completing return" });

    transaction.finePaid = finePaid || transaction.fine === 0;
    transaction.status = "completed";
    await transaction.save();

    res.json({ message: "Return completed successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================ VIEW ALL TRANSACTIONS =================
exports.viewTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("book")
      .populate("user");

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
