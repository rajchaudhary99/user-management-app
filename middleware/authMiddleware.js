const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model if needed

// Middleware function to check for token and authenticate user
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // Optionally: Find user in the database and attach to req.user
    // req.user = await User.findById(decoded.id);

    req.userId = decoded.id; // Attach user ID to request object
    next();
  });
};

module.exports = authMiddleware;