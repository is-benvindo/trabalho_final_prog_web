// index.js
const express = require('express');
const path = require('path');
const filmRoutes = require('./routes/filmRoutes');
const commentRoutes = require('./routes/commentRoutes'); // Importar as rotas de comentários
const app = express();

const PORT = process.env.PORT || 3000;

// Configurar middleware para analisar JSON
app.use(express.json());

// Configurar pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Usar as rotas de filmes
app.use('/api', filmRoutes);

// Usar as rotas de comentários
app.use('/api', commentRoutes);

// Rota para servir o arquivo HTML (interface frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});