const db = require('../config/database');

class Cliente {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(cliente) {
    const { nombre, correo, telefono, direccion } = cliente;
    const [result] = await db.query(
      'INSERT INTO clientes (nombre, correo, telefono, direccion) VALUES (?, ?, ?, ?)',
      [nombre, correo, telefono, direccion]
    );
    return result.insertId;
  }

  static async update(id, cliente) {
    const { nombre, correo, telefono, direccion } = cliente;
    const [result] = await db.query(
      'UPDATE clientes SET nombre=?, correo=?, telefono=?, direccion=? WHERE id=?',
      [nombre, correo, telefono, direccion, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Cliente;