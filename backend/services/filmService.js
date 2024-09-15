const axios = require('axios');
const tmdbApiKey = 'f74d1bd0fef9085c7f2da686824c6faf';

// Criar uma instância do axios para a API do TMDb
const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: tmdbApiKey, 
        language: 'pt-BR',
        include_image_language: 'pt-BR,en'
    }
});

// Função auxiliar para construir o poster
const getPosterUrl = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : null;

// Solicitar os filmes com base no título
exports.fetchFilmsByTitle = async (titulo) => {
    const response = await tmdbApi.get(`/search/movie`, { params: { query: titulo } });

    // Retornar os resultados da busca
    return response.data.results.map(filme => ({
        id: filme.id,
        poster: getPosterUrl(filme.poster_path),
        title: filme.title,
        year: filme.release_date ? filme.release_date.split('-')[0] : 'N/A'
    }));
};

// Solicitar detalhes do filme com base no ID
exports.fetchFilmById = async (id) => {
    const [response, creditsResponse] = await Promise.all([
        tmdbApi.get(`/movie/${id}`),
        tmdbApi.get(`/movie/${id}/credits`)
    ]);

    // Retornar os detalhes do filme
    return {
        id: response.data.id,
        poster: getPosterUrl(response.data.poster_path),
        title: response.data.title,
        year: response.data.release_date ? response.data.release_date.split('-')[0] : 'N/A',
        director: creditsResponse.data.crew.find(member => member.job === 'Director')?.name || 'N/A',
        synopsis: response.data.overview || 'Sinopse não disponível',
        rating: response.data.vote_average || 'N/A'
    };
};


// Solicitar filmes populares
exports.fetchPopularFilms = async () => {
    const response = await tmdbApi.get('/movie/popular');

    // Retornar os filmes populares
    return response.data.results.map(filme => ({
        id: filme.id,
        poster: getPosterUrl(filme.poster_path),
        title: filme.title,
        year: filme.release_date ? filme.release_date.split('-')[0] : 'N/A'
    }));
};
