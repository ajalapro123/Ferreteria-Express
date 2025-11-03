const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporteController');

router.get('/', soporteController.getAll);
router.get('/:id', soporteController.getById);
router.post('/', soporteController.create);
router.put('/:id', soporteController.update);
router.delete('/:id', soporteController.delete);

module.exports = router;