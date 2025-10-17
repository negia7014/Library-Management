const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  protect: async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token invalid' });
    }
  },

  adminOnly: (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ message: 'Admin access required' });
  },

  // ✅ Generic role-based middleware
  verifyRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ message: "Not authorized" });
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
    };
  }
};
