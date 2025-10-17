const mongoose = require('mongoose');
// Assuming your models are in '../models' directory
const Book = require('../models/Book'); 
const Transaction = require('../models/Transaction'); 
const User = require('../models/User'); // Assuming you have a User model for borrowerId check

// Placeholder for the function required in returnBook
const calculateFine = (dueDate, actualReturnDate) => {
    // Simple fine calculation logic: $1 per day late
    const msPerDay = 1000 * 60 * 60 * 24;
    const dueTime = dueDate.getTime();
    const returnTime = actualReturnDate.getTime();

    if (returnTime <= dueTime) {
        return 0; // Not late
    }

    const diffDays = Math.ceil((returnTime - dueTime) / msPerDay);
    const finePerDay = 1; 
    return diffDays * finePerDay;
};


exports.issueBook = async (req, res) => {
    // 1. Get data from request body
    const { borrowerId, title, author, issueDate, returnDate, remarks } = req.body;
    
    // 2. Simple Validation 
    if (!title || !issueDate || !returnDate || !borrowerId) {
        return res.status(400).json({ message: 'Missing required fields: title, Issue Date, Return Date, or Borrower ID.' });
    }

    const issueDt = new Date(issueDate); 
    const returnDt = new Date(returnDate);

    // 3. Find the Book and Check Availability
    let book;
    console.log(Book);
    try {
        book = await Book.findOne({ 
            title: title, 
            author: author, 
            isIssued: false, 
        });
         console.log(title);
         console.log(author);
        console.log("book data from db"+book);
        if (!book) {
            const issuedBook = await Book.findOne({ title: title, author: author, isIssued: true });
            console.log("issuedBook is :"+issuedBook);
            if (issuedBook) {
                return res.status(409).json({ message: `Book titled '${title}' is currently issued.` });
            }

            return res.status(404).json({ message: `Book titled '${title}' not found in the available catalog.` });
        }

    } catch (error) {
        console.error("Error finding book:", error);
        return res.status(500).json({ message: 'Server error during book lookup.' });
    }
    
    // 4. Perform the Issue Transaction (Using Mongoose session for atomicity)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // i. Create a new transaction record
        const newTransaction = new Transaction({
            // MAPPING: req.body.borrowerId -> Transaction.user (Schema field name)
            book: book._id, // Use the Book's unique ID
            user: borrowerId, // Use the Borrower's unique ID
            issueDate: issueDt,
            returnDate: returnDt,
            remarks: remarks,
            status: 'ISSUED'
        });
        await newTransaction.save({ session });

        // ii. Update the Book's status
        await Book.updateOne(
            { _id: book._id }, 
            { $set: { isIssued: true, issuedTo: borrowerId } },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // 5. Success Response
        res.status(201).json({
            message: 'Book issued successfully.',
            transaction: newTransaction
        });

    } catch (error) {
        // Abort transaction on any error
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);

        res.status(500).json({
            message: 'Failed to issue book due to a database error. Transaction rolled back.',
            details: error.message
        });
    }
};
//  RETURN BOOK 

exports.returnBook = async (req, res) => {
  try {
    const { bookId, finePaid, remarks } = req.body;
console.log(bookId);
console.log(finePaid);
    // 1️ Find active issue
    const txn = await Transaction.findOneAndUpdate(
      { book: bookId, status: "ISSUED" },
      {
         status: "RETURNED",
        finePaid: !!finePaid,
        remarks,
        returnDate: new Date(),
      },
      { new: true }
    );
    console.log(txn);

    if (!txn) {
      return res.status(404).json({ success: false, message: "No active issue found" });
    }

      // 2Calculate fine (if overdue)
    const today = new Date();
    const dueDate = new Date(txn.returnDate);
    let fine = 0;

    if (today > dueDate) {
      const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      const perDayFine = 10; // You can change this value
      fine = diffDays * perDayFine;
    }

    // 3Update transaction
    txn.status = "RETURNED";
    txn.actualReturnDate = today;
    txn.fine = fine;
    txn.finePaid = !!finePaid;
    txn.remarks = remarks;
    await txn.save();

    // 2️ Mark book as available
    await Book.findByIdAndUpdate(bookId, {  isIssued: false });

    res.json({
      success: true,
      message: "Book returned successfully",
      data: txn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while returning book" });
  }
};

// Fetch issued books


exports.getIssuedBooks = async (req, res) => {
  try {
    // Fetch books that are currently issued
    const issuedBooks = await Book.find({ isIssued: true }); 

    res.status(200).json({
      success: true,
      data: issuedBooks
    });
  } catch (error) {
    console.error("Error fetching issued books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching issued books"
    });
  }
};

// Fetch book details + fine calculation
exports.getBookDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Find if it has any pending transactions for this user
    const transaction = await Transaction.findOne({
      bookId: id,
      userId: req.user._id,
      returned: false
    });

    // Calculate fine if overdue
    let fineAmount = 0;
    if (transaction) {
      const today = new Date();
      const due = new Date(transaction.dueDate);
      if (today > due) {
        const diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        fineAmount = diff * 10; // e.g., ₹10 per day late
      }
    }

    res.status(200).json({
      success: true,
      data: {
        title: book.title,
        author: book.author,
        fineAmount
      }
    });
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  PAY FINE 
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

