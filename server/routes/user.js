const express = require('express');
const { body } = require('express-validator');
const { getUserBookings, getUserBookingById, createBooking } = require('../controllers/bookingController');
const { validate } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticate);
router.use(authorize('user'));

/**
 * Booking Routes
 */
router.get('/bookings/my', getUserBookings);
router.get('/bookings/:id', getUserBookingById);

router.post('/bookings',
  validate([
    body('roomId').isInt().withMessage('Room ID must be an integer'),
    body('category').isIn(['EVENT', 'REGULAR', 'EXTRA', 'LABS']).withMessage('Invalid booking category'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('description').optional(),
    body('schedules').isArray().withMessage('Schedules must be an array'),
    body('schedules.*.startTime').isISO8601().withMessage('Schedule start time must be a valid date'),
    body('schedules.*.endTime').isISO8601().withMessage('Schedule end time must be a valid date'),
    body('schedules.*.day').isString().withMessage('Day must be a string')
  ]),
  createBooking
);

module.exports = router; 