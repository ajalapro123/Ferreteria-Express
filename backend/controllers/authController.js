const { pool } = require('../config/database');

// Intentamos usar bcrypt si está disponible. Si no, hacemos comparación en texto plano
let bcrypt = null;
try {
  // preferir bcrypt nativo si está instalado
  bcrypt = require('bcrypt');
} catch (err) {
  try {
    // fallback a bcryptjs si está disponible en package.json
    bcrypt = require('bcryptjs');
  } catch (err2) {
    // ningún bcrypt instalado: seguiremos con comparación directa (temporal)
    bcrypt = null;
  }
}

const authController = {
  async login(req, res) {
    // Aceptar correo o username en el mismo campo para compatibilidad con el frontend actual
    const identifier = (req.body?.identifier || req.body?.correo || req.body?.username || '').trim();
    const { password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({ mensaje: 'Faltan credenciales' });
    }

    try {
      // Autenticación: se usa el correo de la tabla clientes (c.correo) y la contraseña almacenada en usuarios.password_hash
      // Mantener esto mientras el formulario de login pida el correo. Si en el futuro se desea login por username, cambiar WHERE.
  const sql = `SELECT u.id AS usuario_id, u.password_hash, u.rol,
          c.id AS cliente_id, c.nombre, c.correo
       FROM usuarios u
       JOIN clientes c ON u.cliente_id = c.id
       WHERE c.correo = ? OR u.username = ?
       LIMIT 1`;
  const [rows] = await pool.query(sql, [identifier, identifier]);

      if (!rows || rows.length === 0) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const u = rows[0];
      const stored = u.password_hash || '';

      // Si bcrypt está disponible y el hash parece de bcrypt, úsalo
      let ok = false;
      if (bcrypt && (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$'))) {
        ok = await bcrypt.compare(password, stored);
      } else {
        // Comparación directa (compatibilidad con DB actual que tiene texto plano)
        ok = password === stored;
      }

      if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

      // Construir usuario público que el frontend necesita
      const usuarioPublico = {
        id: u.cliente_id,
        usuario_id: u.usuario_id,
        nombre: u.nombre,
        correo: u.correo,
        rol: u.rol,
      };

      return res.json({ usuario: usuarioPublico });
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
  ,
  async register(req, res) {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Validar si el correo ya existe en clientes
      const [existeCorreo] = await conn.query('SELECT id FROM clientes WHERE correo = ? LIMIT 1', [email]);
      if (existeCorreo.length > 0) {
        await conn.rollback();
        return res.status(409).json({ success: false, message: 'El correo ya está registrado' });
      }

      // Crear cliente (dirección opcional vacía por ahora)
      const [insCliente] = await conn.query(
        'INSERT INTO clientes (nombre, correo, telefono, direccion) VALUES (?, ?, ?, ?)',
        [name, email, phone, '']
      );
      const clienteId = insCliente.insertId;

      // Generar username a partir del correo
      const baseUser = String(email).split('@')[0].replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 30) || 'user';

      // Asegurar unicidad robusta del username derivado del correo
      let username = baseUser;
      let intentos = 0;
      while (true) {
        // ¿Existe ya?
        // Usamos SELECT 1 para menor coste
        const [existeUser] = await conn.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [username]);
        if (existeUser.length === 0) break; // libre
        intentos++;
        // Estrategia: primeras 3 colisiones añadir sufijo incremental, luego random
        if (intentos <= 3) {
          username = `${baseUser}_${intentos}`.slice(0, 40);
        } else {
          username = `${baseUser}_${Math.floor(1000 + Math.random() * 9000)}`.slice(0, 40);
        }
        if (intentos > 10) {
          // fallback improbable: agrega timestamp corto
            username = `${baseUser}_${Date.now().toString().slice(-6)}`.slice(0, 40);
            break;
        }
      }

      // Guardar usuario con contraseña tal como está (texto plano por compatibilidad actual)
      await conn.query(
        'INSERT INTO usuarios (cliente_id, username, password_hash, rol) VALUES (?, ?, ?, ?)',
        [clienteId, username, password, 'cliente']
      );

      await conn.commit();

      return res.status(201).json({
        success: true,
        message: 'Registro exitoso',
        usuario: { id: clienteId, nombre: name, correo: email, rol: 'cliente', username }
      });
    } catch (err) {
      try { await conn.rollback(); } catch {}
      console.error('Error en register:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    } finally {
      conn.release();
    }
  }
};

module.exports = authController;
