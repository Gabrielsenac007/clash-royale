const express = require('express');
const router = express.Router();
const estatisticaController = require('../controllers/estatistica.controller');

router.get('/', estatisticaController.getEstatisticas);
router.get('/combos', estatisticaController.getCombosVencedores);

module.exports = router;
