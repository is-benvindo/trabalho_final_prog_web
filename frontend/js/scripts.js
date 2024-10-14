document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a busca de posts
    fetchPosts();

    // Adicionar evento de clique no botão de busca
    document.getElementById('searchButton').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm) {
            fetchPosts(searchTerm);
        }
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

// Função para abrir o modal com os detalhes do filme
function openFilmModal(filmeId) {
    fetchFilmDetails(filmeId);
}


// Função para buscar os filmes
async function fetchPosts(query = 'o') {
    try {
        const response = await fetch(`http://localhost:3000/api/filmes/${query}`);
        const posts = await response.json();
        const postsContainer = document.getElementById('postsContainer');

        postsContainer.innerHTML = posts.map(post => `
            <div class="post" onclick="openFilmModal('${post.id}')">
                <img src="${post.poster}" alt="${post.title} Poster" class="poster">
                <div class="post-info">
                    <h2>${post.title}</h2>
                    <p style="font-size: 16px; margin-top: 0px">${post.year}</p>
                    <button onclick="fetchFilmDetails('${post.id}')">Ver detalhes</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.log('Erro ao buscar os posts', error);
    }
}

// Função para buscar detalhes do filme e resenhas
async function fetchFilmDetails(filmeId) {
    try {
        const [filmResponse, reviewsResponse] = await Promise.all([
            fetch(`http://localhost:3000/api/filme/${filmeId}`),
            fetch(`http://localhost:3000/api/resenhas/${filmeId}`)
        ]);
        
        const filmDetails = await filmResponse.json();

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

                <!-- Seção de resenhas -->
                <div class="reviews-section">
                    <h3>Resenhas</h3>
                    <div id="reviewsContainer">
                        <!-- Resenhas serão carregadas aqui -->
                    </div>
                </div>

                <!-- Formulário para adicionar resenha -->
                <div class="comment-form">
                    <input type="text" id="reviewAuthor" placeholder="Seu nome">
                    <textarea id="reviewText" placeholder="Sua resenha"></textarea>
                    <button onclick="submitReviewForm('${filmeId}')">Enviar Resenha</button>
                </div>
            `;

            // Exibir o modal
            document.getElementById('filmModal').style.display = 'block';
            loadReviews(filmeId); // Carregar resenhas após exibir o modal
        } else {
            console.error('Conteúdo do modal não encontrado');
        }
    } catch (error) {
        console.log('Erro ao buscar detalhes do filme ou resenhas', error);
    }
}

// Funções de resenhas
async function loadReviews(filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/resenhas/${filmeId}`);
        const reviews = await response.json();
        const reviewsContainer = document.getElementById('reviewsContainer');

        if (reviewsContainer) {
            reviewsContainer.innerHTML = reviews.length > 0 ? reviews.map(review => `
                <div class="review">
                    <p><strong>${review.autor}:</strong> ${review.texto}</p>
                    <button onclick="editReview('${review.id}', '${filmeId}')">Editar</button>
                    <button onclick="deleteReview('${review.id}', '${filmeId}')">Excluir</button>
                    <button onclick="renderCommentsModal('${review.id}')">Ver Comentários</button>
                    <div id="commentsContainer-${review.id}" style="display: none":></div>
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

// Função para renderizar um modal com o formulário de resenhas
function submitReviewForm(filmeId) {
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

// Funções de comentários
async function loadComments(reviewId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${reviewId}`);
        const comments = await response.json();
        const commentsContainer = document.getElementById(`commentsContainer-${reviewId}`);

        if (commentsContainer) {
            commentsContainer.innerHTML = comments.length > 0 ? comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.autor}:</strong> ${comment.texto}</p>
                    <button onclick="editComment('${comment.id}', '${reviewId}')">Editar</button>
                    <button onclick="deleteComment('${comment.id}', '${reviewId}')">Excluir</button>
                </div>
            `).join('') : '<p>Nenhum comentário disponível.</p>';
        }
    } catch (error) {
        console.log('Erro ao carregar comentários', error);
    }
}

// Função para renderizar um 'modal' com os comentários de uma resenha
async function renderCommentsModal(reviewId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${reviewId}`);
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
                    <button onclick="submitComment('${reviewId}')">Enviar Comentário</button>
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

function submitComment(reviewId) {
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
