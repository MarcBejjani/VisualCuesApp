const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation (you can add more checks here)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Encrypt password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user in the database with the encrypted password
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Return success response
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        // Return error response in JSON format
        return res.status(500).json({ message: 'Error creating user' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        console.log(username);
        console.log(password);
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token
        return res.status(200).json({ message: 'Login successful', token, userId: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

