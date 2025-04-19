const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    
    let user = await prisma.user.findFirst({ where: { email } });
    let role = 'user';
    
    if (!user) {
      user = await prisma.admin.findFirst({ where: { email } });
      role = 'admin';

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // ❗ Plain text password check (not secure)
    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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
