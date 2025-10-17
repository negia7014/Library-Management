const mongoose = require('mongoose');

const txnSchema = new mongoose.Schema({
    // Renamed 'bookId' to 'book' and 'borrowerId' to 'user' for Mongoose referencing
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The borrower
    serialNo: { type: String }, // Assuming this should be here
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    fine: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    remarks: { type: String },
    status: { type: String, enum: ['ISSUED', 'RETURNED', 'OVERDUE'], default: 'ISSUED' }
});


module.exports = mongoose.model('Transaction', txnSchema);
