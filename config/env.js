require('dotenv').config();

module.exports = {
    // Chave da API do TMDb (The Movie Database)
    tmdbApiKey: process.env.TMDB_API_KEY
};

console.log("TMDB API Key:", process.env.TMDB_API_KEY);
