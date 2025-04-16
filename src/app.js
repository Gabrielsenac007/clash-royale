const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cors = require('cors');


// middlewares
app.use(express.json());

app.use(cors()); // Permite todas as origens
// rotas
const batalhaRoutes = require('./routes/batalha.routes');
app.use('/batalhas', batalhaRoutes);

const cartaRoutes = require('./routes/carta.routes');
app.use('/cartas', cartaRoutes);

const jogadorRoutes = require('./routes/jogador.routes');
app.use('/jogadores', jogadorRoutes);

const estatisticaRoutes = require('./routes/estatistica.routes');
app.use('/estatisticas', estatisticaRoutes);


module.exports = app;
