const axios = require('axios');
const { tmdbApiKey } = require('../../config/env');

// Solicitar os filmes com base no título
exports.fetchFilmsByTitle = async (titulo) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            api_key: tmdbApiKey,
            query: titulo
        }
    });

    // Retornar possíveis resultados
    return response.data.results.map(filme => ({
        id: filme.id,
        poster: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
        title: filme.title,
        year: filme.release_date ? filme.release_date.split('-')[0] : 'N/A'
    }));
};

// Solicitar detalhes do filme com base no ID
exports.fetchFilmById = async (id) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: { 
            api_key: tmdbApiKey 
        }
    });

    // Retornar detalhes do filme
    return {
        id: response.data.id,
        poster: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
        title: response.data.title,
        year: response.data.release_date.split('-')[0],
        director: response.data.credits.crew.find(member => member.job === 'Director')?.name || 'N/A',
        synopsis: response.data.overview,
        rating: response.data.vote_average
    };
};
