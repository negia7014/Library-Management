

const mongoose = require('mongoose');



const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre:{ type: String, required: true },
    
    // Type of item (allowing flexibility)
    type: { type: String, enum: ['book', 'movie'], default: 'book' },
    
    isIssued: { 
        type: Boolean, 
        default: false, 
        index: true 
    },
    
    
    // Reference to the borrower (only set when isIssued is true)
    issuedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Compound index for fast lookup of available copies
bookSchema.index({ title: 1, author: 1, isIssued: 1 });

module.exports = mongoose.model('Book', bookSchema);


