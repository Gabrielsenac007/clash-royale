const mongoose = require('mongoose');

const JogadorSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  nivel: { type: Number, required: true },
  trofeus: { type: Number, required: true },
  tempo_jogo: { type: String, default: null }, // ou Number, dependendo do formato
});

module.exports = mongoose.model('Jogador', JogadorSchema, 'jogadores');
