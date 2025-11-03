const { pool } = require('../config/database');

class Producto {
    static async getAll() {
    const [productos] = await pool.query('SELECT * FROM productos');
        return productos;
    }

    static async getById(id) {
    const [producto] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        return producto[0];
    }

    static async create(producto) {
        const { nombre, precio, cantidad, proveedor_id, imagen, url } = producto;
    const [result] = await pool.query(
            'INSERT INTO productos (nombre, precio, cantidad, proveedor_id, imagen, url) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, precio, cantidad, proveedor_id, imagen, url]
        );
        return result.insertId;
    }

    static async update(id, producto) {
        const { nombre, precio, cantidad, proveedor_id, imagen, url } = producto;
    const [result] = await pool.query(
            'UPDATE productos SET nombre=?, precio=?, cantidad=?, proveedor_id=?, imagen=?, url=? WHERE id=?',
            [nombre, precio, cantidad, proveedor_id, imagen, url, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Producto;