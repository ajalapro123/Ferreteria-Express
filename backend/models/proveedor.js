const db = require('../config/database');

class Proveedor {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM proveedores');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { nombre, contacto } = data;
    const [result] = await db.query('INSERT INTO proveedores (nombre, contacto) VALUES (?, ?)', [nombre, contacto]);
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, contacto } = data;
    const [result] = await db.query('UPDATE proveedores SET nombre=?, contacto=? WHERE id=?', [nombre, contacto, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM proveedores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Proveedor;