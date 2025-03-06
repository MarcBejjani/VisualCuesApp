const bcrypt = require('bcrypt');
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
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        // Return error response in JSON format
        res.status(500).json({ message: 'Error creating user' });
    }
};
