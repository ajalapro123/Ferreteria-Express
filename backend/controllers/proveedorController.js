const Proveedor = require('../models/proveedor');

const proveedorController = {
  async getAll(req, res) {
    try {
      const data = await Proveedor.getAll();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  async getById(req, res) {
    try {
      const item = await Proveedor.getById(req.params.id);
      if (item) res.json(item);
      else res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  },

  async create(req, res) {
    try {
      const id = await Proveedor.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  async update(req, res) {
    try {
      const updated = await Proveedor.update(req.params.id, req.body);
      if (updated) res.json({ id: req.params.id, ...req.body });
      else res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Proveedor.delete(req.params.id);
      if (deleted) res.json({ message: 'Proveedor eliminado' });
      else res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  }
};

module.exports = proveedorController;