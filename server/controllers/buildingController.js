const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public Controllers
const getAllBuildings = async (req, res) => {
  try {
    const buildings = await prisma.building.findMany();
    return res.status(200).json(buildings);
  } catch (error) {
    console.error('Error getting buildings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get buildings by id
const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const building = await prisma.building.findUnique({
      where: { buildingId: parseInt(id) }
    });
    
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    
    return res.status(200).json(building);
  } catch (error) {
    console.error('Error getting building:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin Controllers
const createBuilding = async (req, res) => {
  try {
    const { floors } = req.body;
    
    // Get the highest buildingId and increment by 1
    const highestBuilding = await prisma.building.findFirst({
      orderBy: { buildingId: 'desc' }
    });
    
    const newBuildingId = highestBuilding ? highestBuilding.buildingId + 1 : 1;
    
    const building = await prisma.building.create({
      data: {
        buildingId: newBuildingId,
        floors: floors ? parseInt(floors) : null
      }
    });
    
    return res.status(201).json(building);
  } catch (error) {
    console.error('Error creating building:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { floors } = req.body;
    
    const building = await prisma.building.update({
      where: { buildingId: parseInt(id) },
      data: { 
        floors: floors !== undefined ? parseInt(floors) : undefined
      }
    });
    
    return res.status(200).json(building);
  } catch (error) {
    console.error('Error updating building:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Building not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.building.delete({
      where: { buildingId: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting building:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Building not found' });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete building with departments' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // Public
  getAllBuildings,
  
  // Admin
  createBuilding,
  updateBuilding,
  deleteBuilding
}; 