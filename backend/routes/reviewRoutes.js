const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Rota para criar uma nova resenha
router.post('/resenhas', reviewController.createReview);

// Rota para obter resenhas por ID do filme
router.get('/resenhas/:filmeId', reviewController.getReviewsByMovieId);

// Rota para atualizar uma resenha
router.put('/resenhas/:id', reviewController.updateReview);

// Rota para excluir uma resenha
router.delete('/resenhas/:id', reviewController.deleteReview);

module.exports = router;
