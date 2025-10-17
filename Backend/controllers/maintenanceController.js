const bcrypt = require("bcryptjs");
const Book = require("../models/Book");
const Membership = require("../models/Membership");
const User = require("../models/User");
const UserManagement = require("../models/UserManagement");


// Add Book
exports.addBook = async (req, res) => {
  try {
    const { type,title, author, genre } = req.body;
    console.log(req.body);
    if (!type ||!title || !author || !genre) {
      return res.status(400).json({
        success:false,
         message: "All fields are Required!" 
      });
    }

    const existing = await Book.findOne({ title, author });
    if (existing) {
      return res.status(400).json({
        success:false,
        message: "Book with this title and author already exists"});
    }

    const newBook = await Book.create({ title, author, genre, type: type  });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    console.log(err);
  }
};

// get the book by ID
exports.getBookBYId = async (req, res) => {
  try{
    const book = await Book.findById(req.params.id);
     if(!book){
      return res.status(404).json({ message: "Book not found" });
     }
     res.status(200).json(book);
  }
  catch(err){
    res.status(500).json({ message: "Server error", error: err.message})
  }
}

// Update Book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Add Membership

//  function to calculate the Expiry Date
const calculateExpiryDate = (startDate, duration) => {
  const date = new Date(startDate);
  
  switch (duration) {
    case 'six months':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'One Year':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'Two Years':
      date.setFullYear(date.getFullYear() + 2);
      break;
    default:
      date.setMonth(date.getMonth() + 6);
  }
  return date;
};


// NOTE: Make sure you import the model correctly at the top, e.g., 
// const Membership = require('../models/Member'); 

exports.addMembership = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      contactName, 
      contactAddress, 
      adadharCardNo, 
      membershipDuration 
    } = req.body;

    // --- VALIDATION: Check for existing Aadhaar ---
    const existingMember = await Membership.findOne({ adadharCardNo });
    if (existingMember) {
      return res.status(400).json({ 
        message: 'A member with this Aadhaar Card Number already exists.' 
      });
    }

    // --- DATE CALCULATION (Assume calculateExpiryDate is defined elsewhere) ---
    const startDate = new Date(); 
    const endDate = calculateExpiryDate(startDate, membershipDuration);

    // This creates and saves the document in a single, atomic operation.
    const savedMember = await Membership.create({ 
      firstName,
      lastName,
      contactName,
      contactAddress,
      adadharCardNo,
      membershipDuration,
      startDate,
      endDate,
      active: true, 
      role: 'Patron', 
    });
    
    // Now 'savedMember' is the successfully saved document.
    res.status(201).json({ 
      message: 'New membership added successfully!', 
      member: savedMember // The member data is sent in the response
    });

  } catch (err) {
    console.error('Error adding membership:', err.message);
    
    // Handle Mongoose validation errors (e.g., missing required field)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed: ' + err.message, 
        error: err.message 
      });
    }
    
    // Handle other server errors
    res.status(500).json({ 
      message: 'Server error during membership creation', 
      error: err.message 
    });
  }
};

// get Membership By Id
exports.getMembershipById = async(req,res)=>{
  try{
        const getMembership = await Membership.findById(req.params.id);
     if(!getMembership){
      return res.status(404).json({ message: "Membership Info not found" });
     }
     res.status(200).json(getMembership);
  }
  catch(err){
    res.status(500).json({ message: "Server error", error: err.message})
  }

  }
//  Update Membership
exports.updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id,req.body, { new: true });
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    if (req.body.cancel) {
      membership.active = false;
      await membership.save();
      return res.json(membership);
    }

    // Extend by default 6 months
    const extendBy = req.body.extendMonths || 6;
    membership.endDate.setMonth(membership.endDate.getMonth() + extendBy);
    await membership.save();

    res.json(membership);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Add User
exports.addNewUser = async (req, res) => {
    try {
        const { name, statusActive, isAdmin } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required for the new user.' });
        }

        // Determine the role based on the isAdmin checkbox
        const newRole = isAdmin ? 'Admin' : 'Librarian';

        const newUser = await UserManagement.create({
            name,
            statusActive,
            isAdmin,
        });

        res.status(201).json({
            message: `New user ${name} registered successfully as ${newRole}!`,
            user: newUser
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed.', error: err.message });
        }
        res.status(500).json({ message: 'Server error during user registration.', error: err.message });
    }
};

// Get Existing User by ID
exports.ExistingUserById = async (req, res) => {
  try {
    const user = await UserManagement.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Existing User Info not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Existing User
exports.updateExistingUser = async (req, res) => {
  try {
    const updateUser = await UserManagement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User Management not found" });
    }

    if (req.body.cancel) {
      updateUser.active = false;
      await updateUser.save();
      return res.json({ success: true, user: updateUser });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updateUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
