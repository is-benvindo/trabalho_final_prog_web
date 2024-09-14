const express = require('express');
const path = require('path');
const filmRoutes = require('./routes/filmRoutes');
const app = express();

const PORT = process.env.PORT || 3000;

// Configurar pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Usar as rotas de filmes
app.use('/api', filmRoutes);

// Rota para servir o arquivo HTML (interface frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
