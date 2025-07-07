const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  handleValidationErrors 
} = require('../middleware/validation');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', 
  validateRegistration,
  handleValidationErrors,
  authController.register
);

// POST /api/auth/login - Iniciar sesión
router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile',
  authenticateToken,
  authController.getProfile
);

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify',
  authenticateToken,
  authController.verifyToken
);

module.exports = router;
