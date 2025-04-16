const Jogador = require('../models/Jogador');

// Buscar todos os jogadores
const getAllJogadores = async (req, res) => {
  try {
    const jogadores = await Jogador.find();
    res.json(jogadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
};

// Buscar jogador por ID
const getJogadorById = async (req, res) => {
  try {
    const jogador = await Jogador.findById(req.params.id);
    if (!jogador) return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json(jogador);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogador' });
  }
};


module.exports = {
  getAllJogadores,
  getJogadorById
};
