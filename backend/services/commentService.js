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

const comments = loadComments();

// Adicionar um comentário
exports.addComment = (resenhaId, autor, texto) => {
    const novoComentario = { 
        id: comments.length + 1, 
        resenhaId: resenhaId, 
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
    return comments.filter(comment => comment.resenhaId === parseInt(reviewId));
};

// Atualizar um comentário
exports.updateComment = (id, texto) => {
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
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        comments.splice(index, 1);
        saveComments(comments);
        return true;
    }
    return false;
};

// Excluir comentários por ID da resenha
exports.deleteCommentsByReviewId = (reviewId) => {
    const newComments = comments.filter(c => c.resenhaId !== parseInt(reviewId));
    if (newComments.length < comments.length) {
        comments = newComments;
        saveComments(comments);
        return true;
    }
    return false;
};
