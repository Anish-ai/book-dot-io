const express = require('express');
const authRoutes = require('./auth');
const publicRoutes = require('./public');
const userRoutes = require('./user');
const adminRoutes = require('./admin');

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Public routes (no auth required)
router.use('/', publicRoutes);

// User routes (auth required, role: user)
router.use('/', userRoutes);

// Admin routes (auth required, role: admin)
router.use('/admin', adminRoutes);

module.exports = router; 