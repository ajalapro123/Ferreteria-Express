const Usuario = require('../models/usuario');

const usuarioController = {
  async getAll(req, res) {
    try {
      const usuarios = await Usuario.getAll();
      res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  async getById(req, res) {
    try {
      const usuario = await Usuario.getById(req.params.id);
      if (usuario) res.json(usuario);
      else res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  async create(req, res) {
    try {
      const id = await Usuario.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  async update(req, res) {
    try {
      const updated = await Usuario.update(req.params.id, req.body);
      if (updated) res.json({ id: req.params.id, ...req.body });
      else res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Usuario.delete(req.params.id);
      if (deleted) res.json({ message: 'Usuario eliminado' });
      else res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
};

module.exports = usuarioController;