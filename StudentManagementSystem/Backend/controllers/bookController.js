const Book = require('../models/Book');


exports.searchBooks = async (req, res) => {
const { q, type } = req.query;
if(!q && !type) return res.status(400).json({ message: 'Enter at least one search criteria' });
const cond = {};
if(q) cond.title = { $regex: q, $options: 'i' };
if(type) cond.type = type;
const books = await Book.find(cond).limit(50);
res.json(books);
};