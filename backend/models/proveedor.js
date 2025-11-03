const { pool } = require('../config/database');

class Proveedor {
  static async getAll() {
  const [rows] = await pool.query('SELECT * FROM proveedores');
    return rows;
  }

  static async getById(id) {
  const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { nombre, contacto } = data;
  const [result] = await pool.query('INSERT INTO proveedores (nombre, contacto) VALUES (?, ?)', [nombre, contacto]);
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, contacto } = data;
  const [result] = await pool.query('UPDATE proveedores SET nombre=?, contacto=? WHERE id=?', [nombre, contacto, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
  const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Proveedor;