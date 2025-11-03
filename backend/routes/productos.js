const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// GET /productos - Obtener todos los productos
router.get('/', productoController.getAllProducts);

// GET /productos/:id - Obtener un producto por ID
router.get('/:id', productoController.getProduct);

// POST /productos - Crear un nuevo producto
router.post('/', productoController.createProduct);

// PUT /productos/:id - Actualizar un producto
router.put('/:id', productoController.updateProduct);

// DELETE /productos/:id - Eliminar un producto
router.delete('/:id', productoController.deleteProduct);

module.exports = router;