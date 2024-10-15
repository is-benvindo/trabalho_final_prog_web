const reviewService = require('../services/reviewService');

exports.createReview = (req, res) => {
    const { filmeId, autor, texto } = req.body;
    if (!filmeId || !autor || !texto) {
        return res.status(400).json({ message: 'Filme ID, autor e texto são obrigatórios' });
    }
    try {
        const novaResenha = reviewService.addReview(filmeId, autor, texto);
        console.log('Resenha criada:', novaResenha);
        res.status(201).json(novaResenha);
    } catch (error) {
        console.error('Erro ao criar resenha:', error);
        res.status(500).json({ error: 'Erro ao criar resenha' });
    }
};

exports.getReviewsByMovieId = (req, res) => {
    const movieId = req.params.filmeId;
    try {
        const reviews = reviewService.getReviewsByMovieId(movieId);
        res.json(reviews);
    } catch (error) {
        console.error('Erro ao buscar resenhas:', error);
        res.status(500).json({ error: 'Erro ao buscar resenhas' });
    }
};

exports.updateReview = (req, res) => {
    const reviewId = req.params.id;
    const { texto } = req.body;
    try {
        const reviewAtualizada = reviewService.updateReview(reviewId, texto);
        if (reviewAtualizada) {
            res.json(reviewAtualizada);
        } else {
            res.status(404).json({ message: 'Resenha não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao atualizar resenha:', error);
        res.status(500).json({ error: 'Erro ao atualizar resenha' });
    }
}

exports.deleteReview = (req, res) => {
    const reviewId = req.params.id;
    try {
        const resultado = reviewService.deleteReview(reviewId);
        if (resultado) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Resenha não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao excluir resenha:', error);
        res.status(500).json({ error: 'Erro ao excluir resenha' });
    }
}
