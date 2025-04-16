const express = require('express');
const router = express.Router();
const BatalhaController = require('../controllers/batalha.controller');


router.get('/', BatalhaController.listarTodas);
router.get("/vitorias-derrotas/:cartaX", BatalhaController.obterVitoriasDerrotasCarta);
router.get('/decks-vitoriosos', BatalhaController.listarDecksVitoriosos);
router.get("/derrotas-combo", BatalhaController.calcularDerrotasCombo);
router.get('/vitorias/:carta/:zPercent', BatalhaController.getVictoryCount);




module.exports = router;
