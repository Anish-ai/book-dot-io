const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public Controllers
const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        building: true
      }
    });
    
    return res.status(200).json(departments);
  } catch (error) {
    console.error('Error getting departments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin Controllers
const createDepartment = async (req, res) => {
  try {
    const { name, buildingId } = req.body;
    
    // Get the highest deptId and increment by 1
    const highestDept = await prisma.department.findFirst({
      orderBy: { deptId: 'desc' }
    });
    
    const newDeptId = highestDept ? highestDept.deptId + 1 : 1;
    
    const department = await prisma.department.create({
      data: {
        deptId: newDeptId,
        name,
        buildingId: parseInt(buildingId)
      },
      include: {
        building: true
      }
    });
    
    return res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, buildingId } = req.body;
    
    const department = await prisma.department.update({
      where: { deptId: parseInt(id) },
      data: {
        name,
        buildingId: buildingId ? parseInt(buildingId) : undefined
      },
      include: {
        building: true
      }
    });
    
    return res.status(200).json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.department.delete({
      where: { deptId: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting department:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // Public
  getAllDepartments,
  
  // Admin
  createDepartment,
  updateDepartment,
  deleteDepartment
}; 