const express = require('express');
const { getAllRooms, getRoomById } = require('../controllers/roomController');
const { getAllBookings, getBookingsByRoomId } = require('../controllers/bookingController');
const { getAllDepartments } = require('../controllers/departmentController');
const { getAllBuildings } = require('../controllers/buildingController');

const router = express.Router();

/**
 * Room Routes
 */
router.get('/rooms', getAllRooms);
router.get('/rooms/:id', getRoomById);

/**
 * Booking Routes
 */
router.get('/bookings', getAllBookings);
router.get('/bookings/room/:roomId', getBookingsByRoomId);

/**
 * Department Routes
 */
router.get('/departments', getAllDepartments);

/**
 * Building Routes
 */
router.get('/buildings', getAllBuildings);

module.exports = router; 