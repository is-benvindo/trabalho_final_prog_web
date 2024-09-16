// commentService.js
const comments = []; // Array para armazenar os comentários em memória

// Adicionar um comentário
exports.addComment = (postagemId, autor, texto) => {
    const novoComentario = {
        id: comments.length + 1,
        postagemId,
        autor,
        texto,
        criadoEm: new Date()
    };
    comments.push(novoComentario);
    return novoComentario;
};

// Obter comentários por ID da postagem
exports.getCommentsByPostagemId = (postagemId) => {
    return comments.filter(comment => comment.postagemId === parseInt(postagemId));
};

// Atualizar um comentário
exports.updateComment = (id, texto) => {
    const comentario = comments.find(c => c.id === parseInt(id));
    if (comentario) {
        comentario.texto = texto;
        return comentario;
    }
    return null;
};

// Excluir um comentário
exports.deleteComment = (id) => {
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        comments.splice(index, 1);
        return true;
    }
    return false;
};
