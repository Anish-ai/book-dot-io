const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public Controllers
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error('Error getting rooms:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { roomId: parseInt(id) }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    return res.status(200).json(room);
  } catch (error) {
    console.error('Error getting room:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin Controllers
const createRoom = async (req, res) => {
  try {
    const { roomName, type, capacity } = req.body;
    
    // Get the highest roomId and increment by 1
    const highestRoom = await prisma.room.findFirst({
      orderBy: { roomId: 'desc' }
    });
    
    const newRoomId = highestRoom ? highestRoom.roomId + 1 : 1;
    
    const room = await prisma.room.create({
      data: {
        roomId: newRoomId,
        roomName,
        type,
        capacity
      }
    });
    
    return res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomName, type, capacity } = req.body;
    
    const room = await prisma.room.update({
      where: { roomId: parseInt(id) },
      data: { roomName, type, capacity }
    });
    
    return res.status(200).json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.room.delete({
      where: { roomId: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // Public
  getAllRooms,
  getRoomById,
  
  // Admin
  createRoom,
  updateRoom,
  deleteRoom
}; 