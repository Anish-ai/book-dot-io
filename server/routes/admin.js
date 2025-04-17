const express = require('express');
const { body } = require('express-validator');
const { createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { getAdminBookings, getAdminBookingById, updateBooking, deleteBooking, updateBookingStatus } = require('../controllers/bookingController');
const { createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { createBuilding, updateBuilding, deleteBuilding } = require('../controllers/buildingController');
const { createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { validate } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticate);
router.use(authorize('admin'));

/**
 * Department Routes
 */
router.get('/departments', (req, res) => res.redirect('/departments'));
router.post('/departments', 
  validate([
    body('name').notEmpty().withMessage('Department name is required'),
    body('buildingId').isInt().withMessage('Building ID must be an integer')
  ]),
  createDepartment
);
router.put('/departments/:id', 
  validate([
    body('name').optional(),
    body('buildingId').optional().isInt().withMessage('Building ID must be an integer')
  ]),
  updateDepartment
);
router.delete('/departments/:id', deleteDepartment);

/**
 * Building Routes
 */
router.get('/buildings', (req, res) => res.redirect('/buildings'));
router.post('/buildings', 
  validate([
    body('floors').optional().isInt().withMessage('Floors must be an integer')
  ]),
  createBuilding
);
router.put('/buildings/:id', 
  validate([
    body('floors').optional().isInt().withMessage('Floors must be an integer')
  ]),
  updateBuilding
);
router.delete('/buildings/:id', deleteBuilding);

/**
 * Room Routes
 */
router.get('/rooms', (req, res) => res.redirect('/rooms'));
router.post('/rooms', 
  validate([
    body('roomName').notEmpty().withMessage('Room name is required'),
    body('type').notEmpty().withMessage('Room type is required'),
    body('capacity').isInt().withMessage('Capacity must be an integer')
  ]),
  createRoom
);
router.put('/rooms/:id', 
  validate([
    body('roomName').optional(),
    body('type').optional(),
    body('capacity').optional().isInt().withMessage('Capacity must be an integer')
  ]),
  updateRoom
);
router.delete('/rooms/:id', deleteRoom);

/**
 * Booking Routes
 */
router.get('/bookings', getAdminBookings);
router.get('/bookings/:id', getAdminBookingById);
router.put('/bookings/:id', 
  validate([
    body('category').optional().isIn(['EVENT', 'REGULAR', 'EXTRA', 'LABS']).withMessage('Invalid booking category'),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    body('description').optional()
  ]),
  updateBooking
);
router.delete('/bookings/:id', deleteBooking);
router.put('/bookings/:id/status', 
  validate([
    body('status').isIn(['APPROVED', 'REJECTED']).withMessage('Status must be APPROVED or REJECTED')
  ]),
  updateBookingStatus
);

/**
 * Schedule Routes
 */
router.post('/schedules', 
  validate([
    body('requestId').isInt().withMessage('Request ID must be an integer'),
    body('startTime').isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').isISO8601().withMessage('End time must be a valid date'),
    body('roomId').isInt().withMessage('Room ID must be an integer'),
    body('day').isString().withMessage('Day must be a string')
  ]),
  createSchedule
);
router.put('/schedules/:id', 
  validate([
    body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
    body('day').optional().isString().withMessage('Day must be a string')
  ]),
  updateSchedule
);
router.delete('/schedules/:id', deleteSchedule);

module.exports = router; 