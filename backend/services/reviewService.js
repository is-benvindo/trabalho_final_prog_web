const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../data');
const filePath = path.join(directoryPath, 'reviews.json');

// Criar o arquivo se não existir
const ensureFileExists = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

// Carregar resenhas do arquivo
const loadReviews = () => {
    ensureFileExists();
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Salvar resenhas no arquivo
const saveReviews = (reviews) => {
    ensureFileExists();
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
};

// Adicionar uma resenha
exports.addReview = (filmeId, autor, texto) => {
    const reviews = loadReviews();
    const novaResenha = { 
        id: reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 1, 
        filmeId: parseInt(filmeId),
        autor: autor,
        texto: texto,
        data: new Date() 
    };
    reviews.push(novaResenha);
    saveReviews(reviews);
    return novaResenha;
};

// Obter resenhas por ID do filme
exports.getReviewsByMovieId = (movieId) => {
    const reviews = loadReviews();
    return reviews.filter(review => review.filmeId === parseInt(movieId));
};

// Atualizar uma resenha
exports.updateReview = (id, texto) => {
    const reviews = loadReviews();
    const review = reviews.find(r => r.id === parseInt(id));
    if (review) {
        review.texto = texto;
        saveReviews(reviews);
        return review;
    }
    return null;
};

// Excluir uma resenha
exports.deleteReview = (id) => {
    const reviews = loadReviews();
    const index = reviews.findIndex(review => review.id === parseInt(id));
    if (index >= 0) {
        const review = reviews[index];
        reviews.splice(index, 1);
        saveReviews(reviews);
        return review;
    }
    return null;
};
