const Batalha = require('../models/Batalha');
const battleService = require("../services/battleService");

const listarTodas = async (req, res) => {
  try {
    const batalhas = await Batalha.find();
    res.json(batalhas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar batalhas' });
  }
};

const obterVitoriasDerrotasCarta = async (req, res) => {
    const { cartaX } = req.params;
  
    try {
      const resultado = await battleService.calcularVitoriasDerrotasCarta(cartaX);
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  async function listarDecksVitoriosos(req, res) {
    try {
      const { limite, inicio, fim } = req.query;
  
      const resultado = await battleService.listarDecksComMaisVitorias(
        parseFloat(limite),
        inicio,
        fim
      );
  
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao listar decks vitoriosos:", error);
      res.status(500).json({ message: "Erro ao listar decks vitoriosos" });
    }
  }

  async function calcularDerrotasCombo(req, res) {
    try {
      const { cartas, inicio, fim } = req.query;
  
      if (!cartas) {
        return res.status(400).json({ erro: "Parâmetro 'cartas' é obrigatório" });
      }
  
      const combo = cartas.split(',').map(c => c.trim());
  
      const resultado = await battleService.calcularDerrotasComCombo(combo, inicio, fim);
  
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao calcular derrotas com combo:", error);
      res.status(500).json({ erro: "Erro ao calcular derrotas com combo" });
    }
  }
  
  const getVictoryCount = async (req, res) => {
    try {
      const carta = req.params.carta; // Carta que será pesquisada
      const zPercent = parseFloat(req.params.zPercent); // Percentual de diferença nos troféus
  
      if (isNaN(zPercent)) {
        return res.status(400).json({ error: 'O percentual de troféus deve ser um número válido.' });
      }
  
      // Chama o serviço para contar as vitórias
      const resultado = await battleService.getVictoryCount(carta, zPercent);
  
      // Retorna o resultado da consulta
      res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao processar a consulta.' });
    }
  };
  
  
module.exports = {
  listarTodas,
  obterVitoriasDerrotasCarta,
  listarDecksVitoriosos,
  calcularDerrotasCombo,
  getVictoryCount
};
