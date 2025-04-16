const express = require('express');
const router = express.Router();
const CartaController = require('../controllers/carta.controller');

router.get('/', CartaController.getAllCartas);
router.get('/nome/:nome', CartaController.getCartaByNome);
router.get('/id/:id', CartaController.getCartaById);

module.exports = router;
