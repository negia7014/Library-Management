const mongoose = require('mongoose');


const txnSchema = new mongoose.Schema({
book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
serialNo: { type: String, required: true },
issueDate: { type: Date, required: true },
returnDate: { type: Date, required: true },
actualReturnDate: { type: Date },
fine: { type: Number, default: 0 },
finePaid: { type: Boolean, default: false },
remarks: { type: String }
});


module.exports = mongoose.model('Transaction', txnSchema);