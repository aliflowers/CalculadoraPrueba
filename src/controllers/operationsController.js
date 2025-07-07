const Operation = require('../models/Operation');

const saveOperation = async (req, res) => {
  try {
    const { expression, result, operation_type } = req.body;
    const userId = req.user.id;

    const operation = await Operation.create({
      user_id: userId,
      expression,
      result,
      operation_type
    });

    res.status(201).json({
      message: 'Operación guardada exitosamente',
      operation
    });
  } catch (error) {
    console.error('Error guardando operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar la operación'
    });
  }
};

const getOperations = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const operations = await Operation.findByUserId(userId, limit, offset);
    const total = await Operation.countByUserId(userId);

    res.json({
      message: 'Operaciones obtenidas exitosamente',
      operations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo operaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones'
    });
  }
};

const deleteOperation = async (req, res) => {
  try {
    const operationId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(operationId)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID de la operación debe ser un número válido'
      });
    }

    const deletedOperation = await Operation.deleteById(operationId, userId);

    if (!deletedOperation) {
      return res.status(404).json({
        error: 'Operación no encontrada',
        message: 'La operación no existe o no pertenece al usuario'
      });
    }

    res.json({
      message: 'Operación eliminada exitosamente',
      operationId: deletedOperation.id
    });
  } catch (error) {
    console.error('Error eliminando operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la operación'
    });
  }
};

const clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedCount = await Operation.deleteAllByUserId(userId);

    res.json({
      message: 'Historial limpiado exitosamente',
      deletedOperations: deletedCount
    });
  } catch (error) {
    console.error('Error limpiando historial:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo limpiar el historial'
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Operation.countByUserId(userId);

    // Obtener estadísticas por tipo de operación
    const { rows: typeStats } = await require('../config/database').query(`
      SELECT operation_type, COUNT(*) as count
      FROM operations
      WHERE user_id = $1
      GROUP BY operation_type
      ORDER BY count DESC
    `, [userId]);

    // Obtener operaciones por día (últimos 30 días)
    const { rows: dailyStats } = await require('../config/database').query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM operations
      WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [userId]);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      statistics: {
        totalOperations: total,
        operationsByType: typeStats,
        dailyOperations: dailyStats
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
};

module.exports = {
  saveOperation,
  getOperations,
  deleteOperation,
  clearHistory,
  getStatistics
};
