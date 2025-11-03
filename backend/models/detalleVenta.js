const db = require('../config/database');

class DetalleVenta {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM detalle_venta');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM detalle_venta WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(detalle) {
    const { venta_id, producto_id, cantidad, precio_unitario } = detalle;
    const [result] = await db.query(
      'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [venta_id, producto_id, cantidad, precio_unitario]
    );
    return result.insertId;
  }

  static async update(id, detalle) {
    const { venta_id, producto_id, cantidad, precio_unitario } = detalle;
    const [result] = await db.query(
      'UPDATE detalle_venta SET venta_id=?, producto_id=?, cantidad=?, precio_unitario=? WHERE id=?',
      [venta_id, producto_id, cantidad, precio_unitario, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM detalle_venta WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = DetalleVenta;