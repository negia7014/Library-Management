const mongoose = require('mongoose');


const membershipSchema = new mongoose.Schema({
  
  firstName: { 
    type: String, 
    required: [true, 'First Name is required'], 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last Name is required'], 
    trim: true 
  },
  contactName: { 
    type: String, 
    required: true,
    trim: true 
  },
  contactAddress: { 
    type: String, 
    required: true 
  },
  adadharCardNo: { 
    type: String, 
    required: true, 
    unique: true 
  },

  
  membershipDuration: {
    type: String,
    required: [true, 'Membership duration is required'],
    enum: ['six months', 'One Year', 'Two Years'], 
  },
  
 
  startDate: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  
  active: { 
    type: Boolean, 
    default: true 
  },
  
  role: {
    type: String,
    enum: ['Patron', 'Librarian', 'Admin'],
    default: 'Patron', 
  }

}, {
  timestamps: true 
});

module.exports = mongoose.model('Memberships', membershipSchema);