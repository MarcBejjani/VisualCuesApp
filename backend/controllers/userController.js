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

        // Return the user data along with the token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email,
                savedSearches: user.savedSearches,
                _id: user._id,
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            username: user.username,
            savedSearches: user.savedSearches || [],
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.saveArtSearch = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.savedArtSearches.push({
            text: req.body.storyText,   // The search query
            dateAdded: new Date()  // Timestamp
        });

        await user.save();
        res.status(200).json({ message: 'Search saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.retrieveArtSearches = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ savedArtSearches: user.savedArtSearches, savedStoryGenerations: user.savedStoryGenerations || [] });
    } catch (error) {
        console.error("Error retrieving saved searches:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.saveStoryGeneration = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.savedStoryGenerations.push({
            text: req.body.storyText,
            image: req.body.imageUrl,
            dateAdded: new Date()  // Timestamp
        });

        await user.save();
        res.status(200).json({ message: 'Search saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

