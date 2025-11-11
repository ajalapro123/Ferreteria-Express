const { pool } = require('../config/database');

const checkoutController = {
  async checkout(req, res) {
    try {
      const { clienteId = null, metodoPago, items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ ok: false, mensaje: 'Carrito vacío' });
      }

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();

        // Validar stock, recoger información de productos y calcular total
        let total = 0;
        const productInfo = {}; // map id -> { id, nombre, precio, cantidad }
        for (const it of items) {
          const [rows] = await conn.query('SELECT id, nombre, precio, cantidad FROM productos WHERE id = ? FOR UPDATE', [it.id]);
          if (!rows || rows.length === 0) throw new Error(`Producto ${it.id} no encontrado`);
          const producto = rows[0];
          if (producto.cantidad < Number(it.cantidad)) throw new Error(`Stock insuficiente para producto ${it.id}`);
          productInfo[it.id] = producto;
          total += Number(producto.precio) * Number(it.cantidad);
        }

        // Insertar venta
        const estado = 'confirmado';
        const [rVenta] = await conn.query('INSERT INTO ventas (cliente_id, total, estado) VALUES (?, ?, ?)', [clienteId, total, estado]);
        const ventaId = rVenta.insertId;

        // Insertar detalle_venta y descontar stock. Construir array de items para respuesta
        const ventaItems = [];
        for (const it of items) {
          const prod = productInfo[it.id];
          const precio_unitario = prod.precio;
          await conn.query('INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [ventaId, it.id, it.cantidad, precio_unitario]);
          const [rUpdate] = await conn.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [it.cantidad, it.id]);
          if (rUpdate.affectedRows === 0) throw new Error(`No se pudo actualizar stock para producto ${it.id}`);
          ventaItems.push({ producto_id: it.id, nombre: prod.nombre, cantidad: Number(it.cantidad), precio_unitario: Number(precio_unitario) });
        }

        await conn.commit();
        return res.json({ ok: true, venta: { id: ventaId, total, items: ventaItems } });
      } catch (err) {
        await conn.rollback();
        console.error('Error en checkout transaction:', err);
        return res.status(400).json({ ok: false, mensaje: err.message || 'Error al procesar pedido' });
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error('Error en checkout:', err);
      return res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
    }
  }
};

module.exports = checkoutController;
