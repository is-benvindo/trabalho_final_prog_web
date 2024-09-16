const filmService = require('../services/filmService');

// Função para buscar filmes por título
exports.getFilmsByTitle = async (req, res) => {
    const titulo = req.params.titulo;

    // Verificar se o título foi fornecido
    if (!titulo) {
        return res.status(400).json({ message: 'Título é obrigatório' });
    }

    try {
        const filmes = await filmService.fetchFilmsByTitle(titulo);
        
        // Verificar se há resultados
        if (filmes.length > 0) {
            res.json(filmes);
        } else {
            res.status(404).json({ message: 'Filme não encontrado' });
        }
    } catch (error) {
        console.log('Erro ao buscar dados do filme:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do filme' });
    }
};

// Função para buscar detalhes de um filme por ID
exports.getFilmById = async (req, res) => {
    const filmeId = req.params.id;

    // Verificar se o ID do filme foi fornecido
    if (!filmeId) {
        return res.status(400).json({ message: 'ID do filme é obrigatório' });
    }

    try {
        // Montar o objeto com detalhes do filme
        const filmeDetalhes = await filmService.fetchFilmById(filmeId);
        res.json(filmeDetalhes);
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do filme' });
    }
};

// Função para buscar filmes populares
exports.getPopularFilms = async (req, res) => {  // Corrigido
    try {
        const filmesPopulares = await filmService.fetchPopularFilms();
        res.json(filmesPopulares);
    } catch (error) {
        console.error('Erro ao buscar filmes populares:', error);
        res.status(500).json({ error: 'Erro ao buscar filmes populares' });
    }
};