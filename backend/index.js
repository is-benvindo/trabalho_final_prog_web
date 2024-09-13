const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Chave da API do TMDb
const tmdbApiKey = '13646bc880456f932c64a037ae59b100';  // Substitua pela chave correta da TMDb

// Configurar pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota para buscar filmes pelo título usando a API do TMDb
app.get('/api/filmes/:titulo', async (req, res) => {
    const titulo = req.params.titulo;

    try {
        // Solicitar os filmes com base no título
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: tmdbApiKey,
                query: titulo
            }
        });
        
        // Verificar se há resultados
        if (response.data.results && response.data.results.length > 0) {
            const filmes = response.data.results.map(filme => ({
                id: filme.id,
                poster: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
                title: filme.title,
                year: filme.release_date ? filme.release_date.split('-')[0] : 'N/A'
            }));

            res.json(filmes);
        } else {
            res.status(404).json({ message: 'Filme não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do filme' });
    }
});

// Rota para buscar detalhes do filme específico (inclui diretor, sinopse, etc.)
app.get('/api/filme/:id', async (req, res) => {
    const filmeId = req.params.id;

    try {
        // Solicitar detalhes do filme com base no ID
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${filmeId}`, {
            params: {
                api_key: tmdbApiKey
            }
        });

        // Montar o objeto com detalhes do filme
        const filmeDetalhes = {
            id: response.data.id,
            poster: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
            title: response.data.title,
            year: response.data.release_date.split('-')[0],
            director: response.data.credits.crew.find(member => member.job === 'Director')?.name || 'N/A',
            synopsis: response.data.overview,
            rating: response.data.vote_average
        };

        res.json(filmeDetalhes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar detalhes do filme' });
    }
});

// Rota para servir o arquivo HTML (interface frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});