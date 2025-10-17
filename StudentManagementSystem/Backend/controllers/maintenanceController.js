const bcrypt = require("bcryptjs");
const Book = require("../models/Book");
const Membership = require("../models/Membership");
const User = require("../models/User");

// ==================== BOOK ====================

// ➕ Add Book
exports.addBook = async (req, res) => {
  try {
    const { title, author, serialNo, type } = req.body;

    if (!title || !author || !serialNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Book.findOne({ serialNo });
    if (existing) {
      return res.status(400).json({ message: "Book with this serial number already exists" });
    }

    const newBook = await Book.create({ title, author, serialNo, type: type || "Book" });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔄 Update Book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== MEMBERSHIP ====================

// ➕ Add Membership
exports.addMembership = async (req, res) => {
  try {
    const { userId, durationMonths } = req.body;
    if (!userId || !durationMonths)
      return res.status(400).json({ message: "Missing fields" });

    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(durationMonths));

    const membership = await Membership.create({
      user: userId,
      startDate: start,
      endDate: end,
      active: true,
    });

    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔄 Update Membership
exports.updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
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

// ==================== USER ====================

// ➕ Add User
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default user
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔄 Update User (Existing User)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
