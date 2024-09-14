document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a busca de posts
    fetchPosts();
});

// Função para buscar os filmes
async function fetchPosts() {
    try {
        // Substitua 'matrix' com um valor real ou inclua um campo de busca no frontend para capturar o título
        const response = await fetch(`http://localhost:3000/api/filmes/matrix`);
        const posts = await response.json();
        const postsContainer = document.getElementById('postsContainer');

        // Exibir os posts de filmes com comentários
        postsContainer.innerHTML = posts.map(post => `
            <div class="post">
                <img src="${post.poster}" alt="${post.title} Poster" class="poster">
                <div class="post-info">
                    <h2>${post.title}</h2>
                    <p><strong>Ano:</strong> ${post.year}</p>
                    <button onclick="fetchFilmDetails('${post.id}')">Ver detalhes</button>
                    <div id="filmDetails-${post.id}" class="film-details"></div>
                    <h3>Comentários:</h3>
                    <div class="comments">
                        ${getCommentsForFilm(post.title).map(comment => `
                            <div class="comment">
                                <p>${comment}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.log('Erro ao buscar os posts', error);
    }
}

// Função para buscar detalhes de um filme específico
async function fetchFilmDetails(filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/filme/${filmeId}`);
        const filmDetails = await response.json();
        const detailsContainer = document.getElementById(`filmDetails-${filmeId}`);

        // Exibir detalhes do filme (diretor, sinopse e avaliação)
        detailsContainer.innerHTML = `
            <p><strong>Diretor:</strong> ${filmDetails.director}</p>
            <p><strong>Sinopse:</strong> ${filmDetails.synopsis}</p>
            <p><strong>Avaliação IMDb:</strong> ${filmDetails.rating}</p>
        `;
    } catch (error) {
        console.log('Erro ao buscar detalhes do filme', error);
    }
}

// Função fictícia para obter comentários sobre um filme
function getCommentsForFilm(filmTitle) {
    // Exemplo de comentários fictícios
    const comments = {
        'Matrix': ['Um filme inovador!', 'Revolucionou o cinema.'],
        'Exemplo de Filme': ['Comentário 1', 'Comentário 2']
    };

    return comments[filmTitle] || ['Nenhum comentário ainda.'];
}
