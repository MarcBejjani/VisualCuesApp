// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the home page!' });
});

// Art Search - Image selection
app.post('/api/search-images', (req, res) => {
    const story = req.body.story;

    // Hardcoded image URLs
    const images = [
        'http://localhost:5001/sample_images/antoine-blanchard_place-de-la-concorde.jpg',
        'http://localhost:5001/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg',
        'http://localhost:5001/sample_images/ipolit-strambu_woman-with-umbrella.jpg'
    ];

    res.json({ images: images });
});

// Art Search - Story generation
app.post('/api/generate-story', (req, res) => {
    const imageUrl = req.body.imageUrl;

    const sampleText = ` You selected the image at ${imageUrl}.`;
    const responseText = sampleText;

    res.json({ text: responseText });
});

// Story generation - Image selection
app.post('/api/select-images', (req, res) => {
    const story = req.body.story;

    // Hardcoded image URLs
    const images = [
        'http://localhost:5001/sample_images/antoine-blanchard_place-de-la-concorde.jpg',
        'http://localhost:5001/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg',
        'http://localhost:5001/sample_images/ipolit-strambu_woman-with-umbrella.jpg'
    ];

    res.json({ images: images });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
