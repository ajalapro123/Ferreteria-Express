const Cliente = require('../models/cliente');

const clienteController = {
  async getAll(req, res) {
    try {
      const clientes = await Cliente.getAll();
      res.json(clientes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  },

  async getById(req, res) {
    try {
      const cliente = await Cliente.getById(req.params.id);
      if (cliente) res.json(cliente);
      else res.status(404).json({ error: 'Cliente no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  },

  async create(req, res) {
    try {
      const id = await Cliente.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  },

  async update(req, res) {
    try {
      const updated = await Cliente.update(req.params.id, req.body);
      if (updated) res.json({ id: req.params.id, ...req.body });
      else res.status(404).json({ error: 'Cliente no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Cliente.delete(req.params.id);
      if (deleted) res.json({ message: 'Cliente eliminado' });
      else res.status(404).json({ error: 'Cliente no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }
};

module.exports = clienteController;