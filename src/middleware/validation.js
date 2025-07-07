const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

const validateOperation = [
  body('expression')
    .trim()
    .notEmpty()
    .withMessage('La expresión es requerida')
    .isLength({ max: 1000 })
    .withMessage('La expresión es demasiado larga'),
  body('result')
    .trim()
    .notEmpty()
    .withMessage('El resultado es requerido'),
  body('operation_type')
    .trim()
    .notEmpty()
    .withMessage('El tipo de operación es requerido')
    .isIn(['basic', 'scientific', 'trigonometric', 'logarithmic', 'exponential', 'statistical'])
    .withMessage('Tipo de operación no válido')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      message: 'Los datos proporcionados no cumplen con los requisitos',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateOperation,
  handleValidationErrors
};
