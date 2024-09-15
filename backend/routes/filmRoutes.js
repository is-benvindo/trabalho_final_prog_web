const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');

// Rota para buscar filmes pelo título usando a API do TMDb
router.get('/filmes/:titulo', filmController.getFilmsByTitle);

// Rota para buscar detalhes do filme específico (inclui diretor, sinopse, etc.)
router.get('/filme/:id', filmController.getFilmById);

// Rota para buscar filmes populares
router.get('filmes/populares', filmController.getPopularFilms);

// Exportar o módulo de rotas
module.exports = router;
