const jwt = require('jsonwebtoken');

const verifyIsAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    return res.status(403).json({ message: 'Accès refusé. Token manquant.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = decoded;
    console.log(decoded);
    if (req.user.isAdmin) {
    next();
    } else {
            return res.status(403).json({ message: 'Accès refusé. Non Admin' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = verifyIsAdmin;
