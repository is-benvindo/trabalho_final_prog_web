// commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Rota para criar um novo comentário
router.post('/comentarios', commentController.createComment);

// Rota para obter comentários por ID da postagem
router.get('/comentarios/:postagemId', commentController.getCommentsByPostagemId);

// Rota para atualizar um comentário
router.put('/comentarios/:id', commentController.updateComment);

// Rota para excluir um comentário
router.delete('/comentarios/:id', commentController.deleteComment);

module.exports = router;
