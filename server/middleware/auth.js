const jwt = require('jsonwebtoken');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

/**
 * Role-based authorization middleware
 */
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  console.log('Authorization roles:', roles);
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    // console the required and user roles for debugging
    console.log('req.user.role', req.user.role)
    console.log('req.user', req.user)

    console.log('roles.includes', roles, roles.includes(req.user.role))
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
}; 