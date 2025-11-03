const Venta = require('../models/venta');

const ventaController = {
  async getAll(req, res) {
    try {
      const ventas = await Venta.getAll();
      res.json(ventas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener ventas' });
    }
  },

  async getById(req, res) {
    try {
      const venta = await Venta.getById(req.params.id);
      if (venta) res.json(venta);
      else res.status(404).json({ error: 'Venta no encontrada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener venta' });
    }
  },

  async create(req, res) {
    try {
      const id = await Venta.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear venta' });
    }
  },

  async update(req, res) {
    try {
      const updated = await Venta.update(req.params.id, req.body);
      if (updated) res.json({ id: req.params.id, ...req.body });
      else res.status(404).json({ error: 'Venta no encontrada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar venta' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Venta.delete(req.params.id);
      if (deleted) res.json({ message: 'Venta eliminada' });
      else res.status(404).json({ error: 'Venta no encontrada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar venta' });
    }
  }
};

module.exports = ventaController;