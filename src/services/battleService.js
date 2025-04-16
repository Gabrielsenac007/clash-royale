const mongoose = require('mongoose');
const Batalha = mongoose.connection.collection('batalhas');


async function calcularVitoriasDerrotasCarta(cartaX) {
    try {
      const partidasComCarta = await Batalha.find({
        $or: [
          { 'jogador_1.deck.nome': cartaX },
          { 'jogador_2.deck.nome': cartaX }
        ]
      }).toArray();
  
      const total = partidasComCarta.length;
  
      let vitorias = 0;
      let derrotas = 0;
  
      for (const partida of partidasComCarta) {
        const jogador1TemCarta = partida.jogador_1.deck.some(carta => carta.nome === cartaX);
        const jogador2TemCarta = partida.jogador_2.deck.some(carta => carta.nome === cartaX);
  
        const vencedor = partida.resultado;
  
        if (jogador1TemCarta && vencedor === partida.jogador_1.nome) {
          vitorias++;
        } else if (jogador2TemCarta && vencedor === partida.jogador_2.nome) {
          vitorias++;
        } else {
          derrotas++;
        }
      }
  
      const porcentagemVitorias = total > 0 ? ((vitorias / total) * 100).toFixed(2) : null;
      const porcentagemDerrotas = total > 0 ? ((derrotas / total) * 100).toFixed(2) : null;
  
      return {
        total,
        porcentagemVitorias,
        porcentagemDerrotas
      };
    } catch (error) {
      console.error('Erro no cálculo da carta X:', error);
      throw new Error('Erro ao calcular vitórias e derrotas da carta X');
    }
  }

  async function listarDecksComMaisVitorias(limite = 10, inicio, fim) {
    const filtroData = {};
  
    if (inicio) filtroData.$gte = new Date(inicio);
    if (fim) filtroData.$lte = new Date(fim);
  
    const filtro = Object.keys(filtroData).length
      ? { data: filtroData }
      : {};
  
    const pipeline = [
      { $match: filtro },
  
      {
        $project: {
          vencedor: "$resultado",
          deckVencedor: {
            $cond: [
              { $eq: ["$resultado", "$jogador_1.nome"] },
              "$jogador_1.deck",
              "$jogador_2.deck"
            ]
          }
        }
      },
  
      {
        $group: {
          _id: "$deckVencedor",
          vitorias: { $sum: 1 }
        }
      },
  
      {
        $facet: {
          totalVitorias: [{ $group: { _id: null, total: { $sum: "$vitorias" } } }],
          decks: [{ $project: { deck: "$_id", vitorias: 1 } }]
        }
      },
  
      {
        $unwind: "$totalVitorias"
      },
  
      {
        $project: {
          decks: {
            $filter: {
              input: "$decks",
              as: "deck",
              cond: {
                $gt: [
                  {
                    $divide: ["$$deck.vitorias", "$totalVitorias.total"]
                  },
                  limite / 100
                ]
              }
            }
          }
        }
      },
  
      { $unwind: "$decks" },
      {
        $replaceRoot: { newRoot: "$decks" }
      },
      {
        $project: {
          deck: 1,
          vitorias: 1,
          porcentagem: {
            $multiply: [
              { $divide: ["$vitorias", "$vitorias"] }, // será substituído depois
              100
            ]
          }
        }
      }
    ];
  
    const resultado = await Batalha.aggregate(pipeline).toArray();
    return resultado;
  }

  async function calcularDerrotasComCombo(cartas, inicio, fim) {
    const filtroData = {};
    if (inicio) filtroData.$gte = new Date(inicio);
    if (fim) filtroData.$lte = new Date(fim);
  
    const filtro = Object.keys(filtroData).length
      ? { data: filtroData }
      : {};
  
    const batalhas = await Batalha.find(filtro).toArray();
  
    let derrotas = 0;
  
    for (const partida of batalhas) {
      const deck1 = partida.jogador_1.deck.map(c => c.nome);
      const deck2 = partida.jogador_2.deck.map(c => c.nome);
      const vencedor = partida.resultado;
  
      const jogador1TemCombo = cartas.every(carta => deck1.includes(carta));
      const jogador2TemCombo = cartas.every(carta => deck2.includes(carta));
  
      const jogador1Perdeu = jogador1TemCombo && vencedor !== partida.jogador_1.nome;
      const jogador2Perdeu = jogador2TemCombo && vencedor !== partida.jogador_2.nome;
  
      if (jogador1Perdeu || jogador2Perdeu) {
        derrotas++;
      }
    }
  
    return {
      combo: cartas,
      derrotas,
    };
  }
  

  async function getVictoryCount(nomeCarta, percentualDesvantagem) {
    try {
      const batalhas = await Batalha.find({ resultado: { $ne: null } })
        .toArray();
  
      console.log(`Total de batalhas analisadas: ${batalhas.length}`);
  
      let vitorias = 0;
  
      for (const batalha of batalhas) {
        const { jogador_1, jogador_2, resultado } = batalha;
  
        let playerVencedor, playerPerdedor;
  
        if (resultado === jogador_1.nome) {
          playerVencedor = jogador_1;
          playerPerdedor = jogador_2;
        } else if (resultado === jogador_2.nome) {
          playerVencedor = jogador_2;
          playerPerdedor = jogador_1;
        } else {
          console.log("Resultado não bate com nenhum jogador:", resultado);
          continue;
        }
  
        // 1. Simula duração aleatória entre 60 e 240 segundos
        const duracao = Math.floor(Math.random() * (240 - 60 + 1)) + 60;
        if (duracao >= 120) {
          console.log(`Dur. >= 120s (${duracao}s): pulando`);
          continue;
        }
  
        // 2. Verifica se a carta está no deck do vencedor
        const temCarta = playerVencedor.deck?.some(carta => carta.nome === nomeCarta);
        if (!temCarta) {
          console.log(`Carta ${nomeCarta} não encontrada no deck do vencedor: ${playerVencedor.nome}`);
          continue;
        }
  
        // 3. Verifica se o vencedor tinha Z% menos troféus que o perdedor
        const trofeusV = playerVencedor.trofeus_inicio;
        const trofeusP = playerPerdedor.trofeus_inicio;
  
        if (trofeusV == null || trofeusP == null) {
          console.log("Troféus indefinidos em:", batalha);
          continue;
        }
  
        const porcentagemDif = ((trofeusP - trofeusV) / trofeusP) * 100;
        if (porcentagemDif < percentualDesvantagem) {
          console.log(`Diferença de troféus ${porcentagemDif.toFixed(2)}% < ${percentualDesvantagem}%`);
          continue;
        }
  
        // 4. Perdedor destruiu pelo menos 2 torres
        if (playerPerdedor.coroas < 2) {
          console.log(`Perdedor ${playerPerdedor.nome} fez apenas ${playerPerdedor.coroas} coroas`);
          continue;
        }
  
        console.log(`✅ Vitória contabilizada: ${playerVencedor.nome} com carta ${nomeCarta}, duração ${duracao}s`);
        vitorias++;
      }
  
      return vitorias;
    } catch (erro) {
      console.error("Erro ao processar vitórias:", erro);
      throw new Error("Erro ao processar a consulta de vitórias.");
    }
  }
  
  
  

module.exports = {
  calcularVitoriasDerrotasCarta,
  listarDecksComMaisVitorias,
  calcularDerrotasComCombo,
  getVictoryCount
};
