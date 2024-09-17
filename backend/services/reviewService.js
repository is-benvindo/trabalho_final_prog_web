const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../src/data');
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

const reviews = loadReviews();

// Adicionar uma resenha
exports.addReview = (filmeId, autor, texto) => {
    const novaResenha = { 
        id: reviews.length + 1, 
        filmeId: filmeId,
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
    return reviews.filter(review => review.filmeId === parseInt(movieId));
};

// Atualizar uma resenha
exports.updateReview = (id, texto) => {
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
    const index = reviews.findIndex(review => review.id === parseInt(id));
    if (index >= 0) {
        const review = reviews[index];
        reviews.splice(index, 1);
        saveReviews(reviews);
        return review;
    }
    return null;
}
