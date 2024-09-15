const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');

// Rota para buscar filmes por título
router.get('/filmes/:titulo', filmController.getFilmsByTitle);

// Rota para buscar detalhes do filme por ID
router.get('/filme/:id', filmController.getFilmById);

module.exports = router;