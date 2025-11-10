const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// URL pública base. Se fuerza a producción si no hay variable.
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://ferreteriaexpress.shop';

// helper para construir URL de imagen según dónde las guardes
function buildImageUrl(fileName) {
  // Ajusta el path según dónde sirva Nginx las imágenes.
  return `${PUBLIC_URL}/assets/img/productos/${fileName}`;
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
