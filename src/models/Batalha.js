const mongoose = require('mongoose');

const CartaSchema = new mongoose.Schema({
  nome: String,
  nivel: Number,
  raridade: String,
}, { _id: false });

const JogadorSchema = new mongoose.Schema({
  nome: String,
  trofeus_inicio: Number,
  trofeus_change: Number,
  coroas: Number,
  deck: [CartaSchema],
}, { _id: false });

const BatalhaSchema = new mongoose.Schema({
  playerTag: String,
  data: Date,
  modo: String,
  arena: String,
  jogador_1: JogadorSchema,
  jogador_2: JogadorSchema,
  resultado: String,
});

module.exports = mongoose.model('Batalha', BatalhaSchema);
