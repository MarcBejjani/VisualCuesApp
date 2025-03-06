const express = require('express');
const router = express.Router();
const artController = require('../controllers/artController');

router.post('/api/search-images', artController.searchImages);
router.post('/api/generate-story', artController.generateStory);
router.post('/api/select-images', artController.selectImages);

module.exports = router;
