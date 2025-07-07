const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');
const { authenticateToken } = require('../middleware/auth');
const { validateOperation, handleValidationErrors } = require('../middleware/validation');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// POST /api/operations - Guardar nueva operación
router.post('/',
  validateOperation,
  handleValidationErrors,
  operationsController.saveOperation
);

// GET /api/operations - Obtener historial de operaciones
router.get('/',
  operationsController.getOperations
);

// GET /api/operations/statistics - Obtener estadísticas de operaciones
router.get('/statistics',
  operationsController.getStatistics
);

// DELETE /api/operations/:id - Eliminar operación específica
router.delete('/:id',
  operationsController.deleteOperation
);

// DELETE /api/operations - Limpiar todo el historial
router.delete('/',
  operationsController.clearHistory
);

module.exports = router;
