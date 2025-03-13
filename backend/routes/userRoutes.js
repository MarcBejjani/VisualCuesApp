const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/api/signup', userController.signup);
router.post('/api/login', userController.login);

// Protected routes (require authentication)
router.get('/api/profile', authenticateToken, userController.getProfile);
router.post('/api/save-story', authenticateToken, userController.saveSearch);
router.get('/api/retrieve-searches', authenticateToken, userController.retrieveSearches);

module.exports = router;
    