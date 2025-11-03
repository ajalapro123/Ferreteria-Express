const Producto = require('../models/producto');

const productoController = {
    async getAllProducts(req, res) {
        try {
            const productos = await Producto.getAll();
            res.json(productos);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    async getProduct(req, res) {
        try {
            const producto = await Producto.getById(req.params.id);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    },

    async createProduct(req, res) {
        try {
            const id = await Producto.create(req.body);
            res.status(201).json({ id, ...req.body });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    },

    async updateProduct(req, res) {
        try {
            const updated = await Producto.update(req.params.id, req.body);
            if (updated) {
                res.json({ id: req.params.id, ...req.body });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    },

    async deleteProduct(req, res) {
        try {
            const deleted = await Producto.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Producto eliminado' });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
};

module.exports = productoController;