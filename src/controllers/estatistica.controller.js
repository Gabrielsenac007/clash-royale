const estatisticaService = require('../services/estatistica.service');


async function getEstatisticas(req, res) {
  try {
    const estatisticas = await estatisticaService.listarEstatisticas();
    res.status(200).json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error });
  }
}

const getCombosVencedores = async (req, res) => {
  const { n, y, inicio, fim } = req.query;

  if (!n || !y || !inicio || !fim) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: n, y, inicio, fim' });
  }

  try {
    const resultado = await estatisticaService.listarCombosVencedores(n, y, inicio, fim);
    res.json({ combos: resultado });
  } catch (error) {
    console.error('Erro ao buscar combos vencedores:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};



module.exports = {
  getEstatisticas,
  getCombosVencedores
};
