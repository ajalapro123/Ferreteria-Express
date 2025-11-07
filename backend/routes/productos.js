const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3001';

// helper para construir URL de imagen según dónde las guardes
function buildImageUrl(fileName) {
  // Si las tienes en /assets/img/productos/
  return `${PUBLIC_URL}/assets/img/productos/${fileName}`;

  // Si preferiste /uploads/productos/
  // return `${PUBLIC_URL}/uploads/productos/${fileName}`;
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, precio, cantidad, imagen FROM productos');
    const data = rows.map(p => ({
      ...p,
      url: buildImageUrl(p.imagen)
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
