const mongoose = require('mongoose');

const EstatisticaSchema = new mongoose.Schema({
  vitorias: Number,
  derrotas: Number,
  total: Number,
  carta: String,
  porcentagem_vitorias: Number
});

module.exports = mongoose.model('Estatistica', EstatisticaSchema, 'estatisticas_cartas');
