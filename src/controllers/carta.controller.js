const Carta = require('../models/Carta');

const getAllCartas = async (req, res) => {
  try {
    const cartas = await Carta.find();
    res.status(200).json(cartas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cartas' });
  }
};

const getCartaByNome = async (req, res) => {
  const { nome } = req.params;
  try {
    const carta = await Carta.findOne({ nome });
    if (!carta) return res.status(404).json({ message: 'Carta não encontrada' });
    res.status(200).json(carta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carta por nome' });
  }
};

const getCartaById = async (req, res) => {
  const { id } = req.params;
  try {
    const carta = await Carta.findOne({ id: parseInt(id) });
    if (!carta) return res.status(404).json({ message: 'Carta não encontrada' });
    res.status(200).json(carta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carta por ID' });
  }
};

module.exports = {
  getAllCartas,
  getCartaByNome,
  getCartaById
};
