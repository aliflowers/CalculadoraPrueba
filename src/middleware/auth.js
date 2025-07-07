const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        message: 'No se proporcionó token de autenticación' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado',
        message: 'El token no corresponde a un usuario válido' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente' 
      });
    }

    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al validar autenticación' 
    });
  }
};

module.exports = { authenticateToken };
