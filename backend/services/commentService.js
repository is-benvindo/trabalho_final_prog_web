const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../data');
const filePath = path.join(directoryPath, 'comments.json');

// Criar o arquivo se não existir
const ensureFileExists = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

// Carregar comentários do arquivo
const loadComments = () => {
    ensureFileExists();
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Salvar comentários no arquivo
const saveComments = (comments) => {
    ensureFileExists();
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
};

// Adicionar um comentário
exports.addComment = (resenhaId, autor, texto) => {
    const comments = loadComments();
    const novoComentario = { 
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        resenhaId: parseInt(resenhaId), 
        autor: autor,
        texto: texto, 
        data: new Date()
    };
    comments.push(novoComentario);
    saveComments(comments);
    return novoComentario;
};

// Obter comentários por ID da resenha
exports.getCommentsByReviewId = (reviewId) => {
    const comments = loadComments();
    return comments.filter(comment => comment.resenhaId === parseInt(reviewId));
};

// Atualizar um comentário
exports.updateComment = (id, texto) => {
    const comments = loadComments();
    const comment = comments.find(c => c.id === parseInt(id));
    if (comment) {
        comment.texto = texto;
        saveComments(comments);
        return comment;
    }
    return null;
};

// Excluir um comentário
exports.deleteComment = (id) => {
    const comments = loadComments();
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        comments.splice(index, 1);
        saveComments(comments);
        return true;
    }
    return false;
};
