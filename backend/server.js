const express = require('express');
const cors = require('cors');
const app = express();
const carrinhoRoutes = require('./routes/carrinho');
require('./arduino'); // Inicia leitura do Arduino

app.use(cors());
app.use(express.json());

app.use('/api/carrinho', carrinhoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
