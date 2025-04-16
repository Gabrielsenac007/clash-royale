const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogador.controller');

router.get('/', jogadorController.getAllJogadores);
router.get('/:id', jogadorController.getJogadorById);


module.exports = router;
