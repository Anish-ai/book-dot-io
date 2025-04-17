const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');
const { validate } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Login for user/admin
 * @access  Public
 */
router.post('/login', 
  validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  login
);

module.exports = router; 