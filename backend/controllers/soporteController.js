const Soporte = require('../models/soporte');

const soporteController = {
  async getAll(req, res) {
    try {
      const data = await Soporte.getAll();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener tickets' });
    }
  },

  async getById(req, res) {
    try {
      const item = await Soporte.getById(req.params.id);
      if (item) res.json(item);
      else res.status(404).json({ error: 'Ticket no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener ticket' });
    }
  },

  async create(req, res) {
    try {
      const id = await Soporte.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear ticket' });
    }
  },

  async update(req, res) {
    try {
      const updated = await Soporte.update(req.params.id, req.body);
      if (updated) res.json({ id: req.params.id, ...req.body });
      else res.status(404).json({ error: 'Ticket no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar ticket' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Soporte.delete(req.params.id);
      if (deleted) res.json({ message: 'Ticket eliminado' });
      else res.status(404).json({ error: 'Ticket no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar ticket' });
    }
  }
};

module.exports = soporteController;