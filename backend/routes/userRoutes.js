const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/api/signup', userController.signup);
router.post('/api/login', userController.login);

module.exports = router;
