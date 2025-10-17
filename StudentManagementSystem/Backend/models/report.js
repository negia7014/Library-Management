// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  generatedAt: {
    type: Date,
    default: Date.now
  },
  totalBooks: {
    type: Number,
    required: true
  },
  issuedBooks: {
    type: Number,
    required: true
  },
  returnedBooks: {
    type: Number,
    required: true
  },
  activeMemberships: {
    type: Number,
    required: true
  },
  pendingFines: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Report', reportSchema);
