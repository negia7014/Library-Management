const User = require('../models/User');
const jwt = require('jsonwebtoken');


function genToken(id){
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}


exports.register = async (req, res) => {
const { name, email, password, role } = req.body;
if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
const exists = await User.findOne({ email });
if(exists) return res.status(400).json({ message: 'User exists' });
const user = await User.create({ name, email, password, role });
res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, role: user.role } });
};


exports.login = async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if(!user) return res.status(400).json({ message: 'Invalid credentials' });
const match = await user.matchPassword(password);
if(!match) return res.status(400).json({ message: 'Invalid credentials' });
res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, role: user.role } });
};