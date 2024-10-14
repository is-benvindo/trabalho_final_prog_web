require('dotenv').config();
const express = require('express');
const path = require('path');
const filmRoutes = require('./routes/filmRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
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

// Usar as rotas de resenhas
app.use('/api', reviewRoutes);

// Usar as rotas de autenticação
app.use('/api/auth', authRoutes); // Adicionar as rotas de autenticação

// Rota para servir o arquivo HTML (interface frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
