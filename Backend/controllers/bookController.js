const Book = require('../models/Book');


//  Controller: Get all books 
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}, "title author"); // Only fetch title & author fields
    return res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching books",
    });
  }
};
// Controller: Check if book is available
exports.checkBookAvailability = async (req, res) => {
  try {
    const { title, author } = req.query;
    //  Validation
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: "Title and author are required.",
      });
    }

    //  Search book in DB (case-insensitive)
    const book = await Book.findOne({
      title: new RegExp(`^${title}$`, "i"),
      author: new RegExp(`^${author}$`, "i"),
    });
console.log(book);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found in the library.",
      });
    }

    //  Check availability
    if (book.isIssued) {
      return res.status(200).json({
        success: true,
        available: false,
        message: `Book "${book.title}" by ${book.author} is currently issued.`,
      });
    } else {
      return res.status(200).json({
        success: true,
        available: true,
        //fixed extra double quote here ↓
        message: `Book "${book.title}" by ${book.author} is available for issue.`,
      });
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking book availability.",
    });
  }
};
