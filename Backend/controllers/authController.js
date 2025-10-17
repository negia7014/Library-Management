const User = require('../models/User');
const jwt = require('jsonwebtoken');


function genToken(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}


exports.register = async (req, res) => {
    
    const { name, email, password, membership, role = 'user' } = req.body; 

    // Basic Validation
    if(!name || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        // Check if user already exists 
        const exists = await User.findOne({ email });
        if(exists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });
        
        
        return res.status(201).json({ 
            token: genToken(user._id), 
            user: { id: user._id, name: user.name, role: user.role } 
        });

    } catch (error) {
        //  Catch Mongoose validation/DB errors to prevent server crash (500)
        console.error("Registration Server Error:", error);

        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
       
        return res.status(500).json({ message: 'Server failed to complete registration. Check DB connection.' });
    }
};


exports.login = async (req, res) => {
    const { email, password ,role} = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        
        if(!user) return res.status(401).json({ 
            success:false,
            message: 'Invalid credentials' 
        });
        
        const match = await user.matchPassword(password);
        if(!match) return res.status(401).json({ 
            success:false,
            message: 'Invalid credentials'
         });
        
        res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, role: user.role } });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};


exports.logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
