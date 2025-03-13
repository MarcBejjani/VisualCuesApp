const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path based on your structure

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); // Fetch user from DB

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
