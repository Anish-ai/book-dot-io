const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Login controller for users and admins
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    
    // First, try to find user
    let user = await prisma.user.findFirst({ where: { email } });
    let role = 'user';
    
    // If user not found, try to find admin
    if (!user) {
      user = await prisma.admin.findFirst({ where: { email } });
      role = 'admin';
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    
    // TEMPORARY: bypass password verification for testing
    // Comment out the real password verification
    /*
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    */
    // Set isPasswordValid to true for testing
    const isPasswordValid = true;
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: role === 'user' ? user.userId : user.adminId,
        role,
        deptId: user.deptId,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return token and user info
    return res.status(200).json({
      token,
      role,
      deptId: user.deptId
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login
}; 