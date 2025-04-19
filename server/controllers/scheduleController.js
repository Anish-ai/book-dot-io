const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Admin Controllers
const createSchedule = async (req, res) => {
  try {
    const { requestId, startTime, endTime, roomId, day } = req.body;
    
    const schedule = await prisma.schedule.create({
      data: {
        requestId: parseInt(requestId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        roomId: parseInt(roomId),
        day
      }
    });
    
    return res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, day } = req.body;
    
    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        day
      }
    });
    
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.schedule.delete({
      where: { id: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting schedule:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// get schedule
const getSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// get all schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        booking: true,
        room: true
      }
    });
    
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// get schedules by booking id
const getSchedulesByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const schedules = await prisma.schedule.findMany({
      where: { requestId: parseInt(bookingId) },
      include: {
        booking: true,
        room: true
      }
    });
    
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedule,
  getAllSchedules,
  getSchedulesByBookingId,
};