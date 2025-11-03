const { pool } = require('../config/database');

class Soporte {
  static async getAll() {
  const [rows] = await pool.query('SELECT * FROM soporte');
    return rows;
  }

  static async getById(id) {
  const [rows] = await pool.query('SELECT * FROM soporte WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { cliente_id, asunto, mensaje } = data;
  const [result] = await pool.query('INSERT INTO soporte (cliente_id, asunto, mensaje) VALUES (?, ?, ?)', [cliente_id, asunto, mensaje]);
    return result.insertId;
  }

  static async update(id, data) {
    const { cliente_id, asunto, mensaje, estado } = data;
  const [result] = await pool.query('UPDATE soporte SET cliente_id=?, asunto=?, mensaje=?, estado=? WHERE id=?', [cliente_id, asunto, mensaje, estado, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
  const [result] = await pool.query('DELETE FROM soporte WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Soporte;