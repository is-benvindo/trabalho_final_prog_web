const commentService = require('../services/commentService');

exports.createComment = (req, res) => {
    const { postagemId, autor, texto } = req.body;
    if (!postagemId || !autor || !texto) {
        return res.status(400).json({ message: 'Postagem ID, autor e texto são obrigatórios' });
    }
    try {
        const novoComentario = commentService.addComment(postagemId, autor, texto);
        res.status(201).json(novoComentario);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
};

exports.getCommentsByReviewId = (req, res) => {
    const postagemId = req.params.postagemId;
    try {
        const comentarios = commentService.getCommentsByReviewId(postagemId);
        res.json(comentarios);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
};

exports.updateComment = (req, res) => {
    const comentarioId = req.params.id;
    const { texto } = req.body;
    try {
        const comentarioAtualizado = commentService.updateComment(comentarioId, texto);
        if (comentarioAtualizado) {
            res.json(comentarioAtualizado);
        } else {
            res.status(404).json({ message: 'Comentário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
};

exports.deleteComment = (req, res) => {
    const comentarioId = req.params.id;
    try {
        const resultado = commentService.deleteComment(comentarioId);
        if (resultado) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Comentário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir comentário:', error);
        res.status(500).json({ error: 'Erro ao excluir comentário' });
    }
};
