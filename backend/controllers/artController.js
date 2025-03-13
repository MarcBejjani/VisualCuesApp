const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Art Search - Image selection
exports.searchImages = (req, res) => {
    const story = req.body.story;

    // Hardcoded image URLs
    const images = [
        'http://localhost:5001/sample_images/antoine-blanchard_place-de-la-concorde.jpg',
        'http://localhost:5001/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg',
        'http://localhost:5001/sample_images/ipolit-strambu_woman-with-umbrella.jpg'
    ];

    res.json({ images: images });
};

// Art Search - Story generation
exports.generateStory = (req, res) => {
    const imageUrl = req.body.imageUrl;

    const sampleText = ` You selected the image at ${imageUrl}.`;
    const responseText = sampleText;

    res.json({ text: responseText });
};

// Story generation - Image selection
exports.selectImages = (req, res) => {
    const story = req.body.story;

    // Hardcoded image URLs
    const images = [
        'http://localhost:5001/sample_images/antoine-blanchard_place-de-la-concorde.jpg',
        'http://localhost:5001/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg',
        'http://localhost:5001/sample_images/ipolit-strambu_woman-with-umbrella.jpg'
    ];

    res.json({ images: images });
};