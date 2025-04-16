const mongoose = require('mongoose');

const CartaSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  raridade: String,
  nivel_maximo: Number,
  elixir: Number,
  tipo: String,
  arena: String
});

module.exports = mongoose.model('Carta', CartaSchema);
