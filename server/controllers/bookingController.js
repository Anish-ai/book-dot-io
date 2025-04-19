const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public Controllers
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: 'APPROVED' },
      include: {
        room: true,
        schedules: true
      }
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true,
        schedules: true
      }
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookingsByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const bookings = await prisma.booking.findMany({
      where: { 
        roomId: parseInt(roomId),
        status: 'APPROVED'
      },
      include: {
        schedules: true
      }
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting room bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// User Controllers
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
        schedules: true
      }
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await prisma.booking.findUnique({
      where: { 
        requestId: parseInt(id),
      },
      include: {
        room: true,
        schedules: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden - Not authorized to view this booking' });
    }
    
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, category, startDate, endDate, description, schedules } = req.body;
    
    // Get the highest requestId and increment by 1
    const highestBooking = await prisma.booking.findFirst({
      orderBy: { requestId: 'desc' }
    });

    console.log(highestBooking);
    
    const newRequestId = highestBooking ? highestBooking.requestId + 1 : 1;
    
    // Create booking with initial status 'PENDING'
    const booking = await prisma.booking.create({
      data: {
        requestId: newRequestId,
        category,
        roomId: parseInt(roomId),
        userId,
        status: 'PENDING',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        schedules: {
          create: schedules.map(schedule => ({
            startTime: new Date(schedule.startTime),
            endTime: new Date(schedule.endTime),
            roomId: parseInt(roomId),
            day: schedule.day
          }))
        }
      },
      include: {
        schedules: true
      }
    });
    
    return res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { requestId: parseInt(id) },
      include: {
        room: true,
        user: true,
        schedules: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error getting admin booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
    }
    
    const booking = await prisma.booking.update({
      where: { requestId: parseInt(id) },
      data: { status },
      include: {
        schedules: true
      }
    });
    
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, startDate, endDate, description } = req.body;
    
    const booking = await prisma.booking.update({
      where: { requestId: parseInt(id) },
      data: {
        category,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        description
      }
    });
    
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete associated schedules first
    await prisma.schedule.deleteMany({
      where: { requestId: parseInt(id) }
    });
    
    // Then delete the booking
    await prisma.booking.delete({
      where: { requestId: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminBookings = async (req, res) => {
  try {
    const adminDeptId = req.user.deptId; // Get admin's department from token

    // Fetch bookings where the associated user belongs to the admin's department
    const bookings = await prisma.booking.findMany({
      where: {
        user: {
          deptId: adminDeptId
        }
      },
      include: {
        room: true,
        schedules: true,
        user: {
          select: {
            userId: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching admin department bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // Public
  getAllBookings,
  getBookingsByRoomId,
  
  // User
  getUserBookings,
  getUserBookingById,
  createBooking,
  
  // Admin
  getAdminBookings,
  getAdminBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getBookings,
}; 