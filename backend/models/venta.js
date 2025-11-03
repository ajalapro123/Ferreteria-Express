const db = require('../config/database');

class Venta {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM ventas');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM ventas WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(venta) {
    const { cliente_id, total, estado } = venta;
    const [result] = await db.query(
      'INSERT INTO ventas (cliente_id, total, estado) VALUES (?, ?, ?)',
      [cliente_id, total, estado]
    );
    return result.insertId;
  }

  static async update(id, venta) {
    const { cliente_id, total, estado } = venta;
    const [result] = await db.query(
      'UPDATE ventas SET cliente_id=?, total=?, estado=? WHERE id=?',
      [cliente_id, total, estado, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM ventas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Venta;