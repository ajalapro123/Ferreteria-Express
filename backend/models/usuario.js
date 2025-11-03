const db = require('../config/database');

class Usuario {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM usuarios');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(usuario) {
    const { cliente_id, username, password_hash, rol } = usuario;
    const [result] = await db.query(
      'INSERT INTO usuarios (cliente_id, username, password_hash, rol) VALUES (?, ?, ?, ?)',
      [cliente_id, username, password_hash, rol]
    );
    return result.insertId;
  }

  static async update(id, usuario) {
    const { cliente_id, username, password_hash, rol } = usuario;
    const [result] = await db.query(
      'UPDATE usuarios SET cliente_id=?, username=?, password_hash=?, rol=? WHERE id=?',
      [cliente_id, username, password_hash, rol, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Usuario;