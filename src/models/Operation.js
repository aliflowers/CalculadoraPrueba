const pool = require('../config/database');

class Operation {
  static async create(operationData) {
    const { user_id, expression, result, operation_type } = operationData;

    const query = `
      INSERT INTO operations (user_id, expression, result, operation_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, expression, result, operation_type, created_at
    `;

    const operationResult = await pool.query(query, [user_id, expression, result, operation_type]);
    return operationResult.rows[0];
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT id, expression, result, operation_type, created_at
      FROM operations
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async countByUserId(userId) {
    const query = 'SELECT COUNT(*) as total FROM operations WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].total);
  }

  static async deleteById(id, userId) {
    const query = 'DELETE FROM operations WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async deleteAllByUserId(userId) {
    const query = 'DELETE FROM operations WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rowCount;
  }
}

module.exports = Operation;
