const axios = require('axios');
// Chave da API do TMDb
const tmdbApiKey = 'f74d1bd0fef9085c7f2da686824c6faf';

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
    const filmDetailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: { 
            api_key: tmdbApiKey 
        }
    });

    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        params: { 
            api_key: tmdbApiKey 
        }
    });

    // Encontrar o diretor no resultado dos créditos
    const director = creditsResponse.data.crew.find(member => member.job === 'Director')?.name || 'N/A';

    // Retornar detalhes do filme com o diretor
    return {
        id: filmDetailsResponse.data.id,
        poster: `https://image.tmdb.org/t/p/w500${filmDetailsResponse.data.poster_path}`,
        title: filmDetailsResponse.data.title,
        year: filmDetailsResponse.data.release_date.split('-')[0],
        director: director,
        synopsis: filmDetailsResponse.data.overview,
        rating: filmDetailsResponse.data.vote_average
    };
};