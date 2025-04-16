const Estatistica = require('../models/Estatistica');
const Batalha = require('../models/Batalha');
const { combinations } = require('../utils/combinations');

async function listarEstatisticas() {
  return await Estatistica.find();
}

async function listarCombosVencedores(n, y, inicio, fim) {
  const tamanhoCombo = parseInt(n);
  const percentualMinimo = parseFloat(y);
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  const batalhas = await Batalha.find({
    data: { $gte: dataInicio, $lte: dataFim }
  });

  const estatisticas = new Map();

  for (const batalha of batalhas) {
    const vencedor = batalha.resultado;
    const jogadores = [
      { nome: batalha.jogador_1.nome, deck: batalha.jogador_1.deck },
      { nome: batalha.jogador_2.nome, deck: batalha.jogador_2.deck }
    ];

    for (const jogador of jogadores) {
      const deck = jogador.deck?.map(c => c.nome).sort();
      if (!deck || deck.length < tamanhoCombo) continue;

      const combos = combinations(deck, tamanhoCombo);

      for (const combo of combos) {
        const chave = combo.join('|');

        if (!estatisticas.has(chave)) {
          estatisticas.set(chave, { total: 0, vitorias: 0 });
        }

        const registro = estatisticas.get(chave);
        registro.total += 1;

        if (jogador.nome === vencedor) {
          registro.vitorias += 1;
        }
      }
    }
  }

  const resultado = [];

  for (const [combo, stats] of estatisticas.entries()) {
    const taxa = (stats.vitorias / stats.total) * 100;

    if (taxa > percentualMinimo) {
      resultado.push({
        combo: combo.split('|'),
        total: stats.total,
        vitorias: stats.vitorias,
        taxa_vitoria: taxa.toFixed(2) + '%'
      });
    }
  }

  return resultado;
}


module.exports = {
  listarEstatisticas,
  listarCombosVencedores
};
