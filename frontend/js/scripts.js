document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a busca de posts
    fetchPopularFilms();

    // Adicionar evento de clique no botão de busca
    document.getElementById('searchButton').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm) {
            fetchFilmsByQuery(searchTerm);
        }
        document.getElementById('searchInput').value = '';
    });

    setupModal();
});

// Configuração do modal
function setupModal() {
    const modal = document.querySelector('.modal');

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Função para exibir os filmes populares
fetchPopularFilms = async () => {
    fetchFilms('http://localhost:3000/api/popular');
}

// Função para buscar filmes por query
fetchFilmsByQuery = async (query) => {
    fetchFilms(`http://localhost:3000/api/filmes/${query}`);
}

// Função genérica para buscar filmes
async function fetchFilms(url) {
    try {
        const response = await fetch(url);
        const films = await response.json();
        const postsContainer = document.getElementById('postsContainer');

        postsContainer.innerHTML = films.map(film => `
            <div class="post" onclick="fetchFilmDetails('${film.id}')">
                <img src="${film.poster}" alt="${film.title} Poster" class="poster">
                <div class="post-info">
                    <h2>${film.title}</h2>
                    <p style="font-size: 16px; margin-top: 0px">${film.year}</p>
                    <button>Ver detalhes</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.log('Erro ao buscar os filmes', error);
    }
}

// Função para buscar detalhes do filme e resenhas
async function fetchFilmDetails(filmeId) {
    try {
        const filmResponse = await fetch(`http://localhost:3000/api/filme/${filmeId}`);
        const filmDetails = await filmResponse.json();
        renderFilmModal(filmDetails, filmeId); // Renderizar modal com detalhes do filme
    } catch (error) {
        console.log('Erro ao buscar detalhes do filme ou resenhas', error);
    }
}

// Função para renderizar o modal de detalhes do filme
async function renderFilmModal(filmDetails, filmeId) {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="modal-landscape">
                <img src="${filmDetails.poster}" alt="${filmDetails.title} Poster" class="poster-modal">
                <div class="film-info">
                    <p><strong>Título:</strong> ${filmDetails.title}</p>
                    <p><strong>Diretor:</strong> ${filmDetails.director}</p>
                    <p><strong>Sinopse:</strong> ${filmDetails.synopsis}</p>
                    <p><strong>Avaliação IMDb:</strong> ${filmDetails.rating}</p>
                </div>
            </div>
            <div class="reviews-section">
                <h3>Resenhas</h3>
                <div id="reviewsContainer"></div>
            </div>
            <div class="comment-form">
                <input type="text" id="reviewAuthor" placeholder="Seu nome">
                <textarea id="reviewText" placeholder="Sua resenha"></textarea>
                <button onclick="submitReviewForm('${filmeId}')">Enviar Resenha</button>
            </div>
        `;
        document.getElementById('filmModal').style.display = 'block';
        loadReviews(filmeId);
    }
}

// Função para carregar resenhas
async function loadReviews(filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/resenhas/${filmeId}`);
        const reviews = await response.json();
        const reviewsContainer = document.getElementById('reviewsContainer');

        if (reviewsContainer) {
            reviewsContainer.innerHTML = reviews.length > 0 ? reviews.map(review => `
                <div class="review">
                    <p style="font-size: large"><strong>${review.autor}</strong><p>

                    <div class="comment-text">
                        <p>${review.texto}</p>
                    </div>

                    <button onclick="editReview('${review.id}', '${filmeId}')">Editar</button>
                    <button onclick="deleteReview('${review.id}', '${filmeId}')">Excluir</button>
                    <button onclick="renderCommentsModal('${review.id}')">Ver Comentários</button>
                </div>
            `).join('') : '<p>Nenhuma resenha disponível.</p>';
        }
    } catch (error) {
        console.log('Erro ao carregar resenhas', error);
    }
}

// Função para adicionar uma nova resenha
async function addReview(filmeId, author, text) {
    try {
        const response = await fetch('http://localhost:3000/api/resenhas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filmeId: filmeId, autor: author, texto: text })
        });

        if (response.ok) {
            loadReviews(filmeId); // Recarregar detalhes e resenhas
        } else {
            console.log('Erro ao adicionar resenha');
        }
    } catch (error) {
        console.log('Erro ao adicionar resenha', error);
    }
}

// Função para enviar uma nova resenha
async function submitReviewForm(filmeId) {
    const author = document.getElementById('reviewAuthor').value;
    const text = document.getElementById('reviewText').value;
    if (author && text) {
        addReview(filmeId, author, text);
        document.getElementById('reviewAuthor').value = '';
        document.getElementById('reviewText').value = '';
    } else {
        console.log('Por favor, preencha todos os campos.');
    }
}

// Função para editar uma resenha existente
async function editReview(reviewId, filmeId) {
    const newText = prompt('Digite o novo texto da resenha:');
    if (newText) {
        try {
            const response = await fetch(`http://localhost:3000/api/resenhas/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto: newText })
            });

            if (response.ok) {
                loadReviews(filmeId); // Recarregar detalhes do filme e resenhas
            } else {
                console.log('Erro ao atualizar resenha');
            }
        } catch (error) {
            console.log('Erro ao atualizar resenha', error);
        }
    }
}

// Função para excluir uma resenha
async function deleteReview(reviewId, filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/resenhas/${reviewId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadReviews(filmeId); // Recarregar detalhes e resenhas
        } else {
            console.log('Erro ao excluir resenha');
        }
    } catch (error) {
        console.log('Erro ao excluir resenha', error);
    }
}

// Função para renderizar um modal com os comentários de uma resenha
async function renderCommentsModal(reviewId) {
    try {
        const modalContent = document.querySelector('.modal-content');

        if (modalContent) {
            modalContent.innerHTML = `
                <div class="comments-section">
                    <h3>Comentários da Resenha</h3>
                    <div id="commentsContainer-${reviewId}">
                        <!-- Comentários serão carregados aqui -->
                    </div>
                </div>

                <div class="comment-form">
                    <input type="text" id="commentAuthor" placeholder="Seu nome">
                    <textarea id="commentText" placeholder="Seu comentário"></textarea>
                    <button onclick="submitCommentForm('${reviewId}')">Enviar Comentário</button>
                </div>
            `;
            
            loadComments(reviewId); // Carregar comentários após exibir o modal

        } else {
            console.error('Conteúdo do modal não encontrado');
        }
    } catch (error) {
        console.log('Erro ao carregar comentários', error);
    }
}

// Função para carregar comentários de uma resenha
async function loadComments(reviewId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${reviewId}`);
        const comments = await response.json();
        const commentsContainer = document.getElementById(`commentsContainer-${reviewId}`);

        if (commentsContainer) {
            commentsContainer.innerHTML = comments.length > 0 ? comments.map(comment => `
                <div class="comment">
                    <p style="font-size: large"><strong>${comment.autor}</strong><p>

                    <div class="comment-text">
                        <p>${comment.texto}</p>
                    </div>

                    <button onclick="editComment('${comment.id}', '${reviewId}')">Editar</button>
                    <button onclick="deleteComment('${comment.id}', '${reviewId}')">Excluir</button>
                </div>
            `).join('') : '<p>Nenhum comentário disponível.</p>';
        }
    } catch (error) {
        console.log('Erro ao carregar comentários', error);
    }
}

// Função para enviar um novo comentário
async function submitCommentForm(reviewId) {
    const author = document.getElementById('commentAuthor').value;
    const text = document.getElementById('commentText').value;
    if (author && text) {
        addComment(reviewId, author, text);
        document.getElementById('commentAuthor').value = '';
        document.getElementById('commentText').value = '';
    } else {
        console.log('Por favor, preencha todos os campos.');
    }
}

// Função para adicionar um novo comentário
async function addComment(reviewId, author, text) {
    try {
        const response = await fetch('http://localhost:3000/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resenhaId: reviewId, autor: author, texto: text })
        });

        if (response.ok) {
            loadComments(reviewId); // Recarregar comentários após adicionar
        } else {
            console.log('Erro ao adicionar comentário');
        }
    } catch (error) {
        console.log('Erro ao adicionar comentário', error);
    }
}

// Função para editar um comentário existente
async function editComment(commentId, reviewId) {
    const newText = prompt('Digite o novo texto do comentário:');
    if (newText) {
        try {
            const response = await fetch(`http://localhost:3000/api/comentarios/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto: newText })
            });

            if (response.ok) {
                loadComments(reviewId); // Recarregar comentários após editar
            } else {
                console.log('Erro ao atualizar comentário');
            }
        } catch (error) {
            console.log('Erro ao atualizar comentário', error);
        }
    }
}

// Função para excluir um comentário
async function deleteComment(commentId, reviewId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${commentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadComments(reviewId); // Recarregar comentários após excluir
        } else {
            console.log('Erro ao excluir comentário');
        }
    } catch (error) {
        console.log('Erro ao excluir comentário', error);
    }
}
