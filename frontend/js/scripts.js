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

    // Configuração para o fechamento do modal
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.modal .close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Função para buscar os filmes
async function fetchPosts(query = 'matrix') {
    try {
        const response = await fetch(`http://localhost:3000/api/filmes/${query}`);
        const posts = await response.json();
        const postsContainer = document.getElementById('postsContainer');

        postsContainer.innerHTML = posts.map(post => `
            <div class="post">
                <img src="${post.poster}" alt="${post.title} Poster" class="poster">
                <div class="post-info">
                    <h2>${post.title}</h2>
                    <p><strong>Ano:</strong> ${post.year}</p>
                    <button onclick="fetchFilmDetails('${post.id}')">Ver detalhes</button>
                    <button onclick="showCommentForm('${post.id}')">Adicionar Comentário</button>
                    <div id="comments-${post.id}" class="comments"></div>
                    <div id="filmDetails-${post.id}" class="film-details"></div>
                </div>
            </div>
        `).join('');

        // Carregar comentários para cada postagem
        posts.forEach(post => loadComments(post.id));
    } catch (error) {
        console.log('Erro ao buscar os posts', error);
    }
}

async function loadComments(postId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${postId}`);
        const comments = await response.json();
        const commentsContainer = document.getElementById(`comments-${postId}`);

        if (commentsContainer) {
            commentsContainer.innerHTML = comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.autor}:</strong> ${comment.texto}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.log('Erro ao carregar comentários', error);
    }
}

async function addComment(postId, author, text) {
    try {
        const response = await fetch('http://localhost:3000/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postagemId: postId, autor: author, texto: text })
        });

        if (response.ok) {
            loadComments(postId); // Recarregar comentários após adicionar
        } else {
            console.log('Erro ao adicionar comentário');
        }
    } catch (error) {
        console.log('Erro ao adicionar comentário', error);
    }
}

function showCommentForm(postId) {
    const formHtml = `
        <div>
            <input type="text" id="commentAuthor" placeholder="Seu nome">
            <textarea id="commentText" placeholder="Seu comentário"></textarea>
            <button onclick="submitComment('${postId}')">Enviar Comentário</button>
        </div>
    `;
    document.getElementById(`comments-${postId}`).innerHTML = formHtml;
}

function submitComment(postId) {
    const author = document.getElementById('commentAuthor').value;
    const text = document.getElementById('commentText').value;
    if (author && text) {
        addComment(postId, author, text);
    } else {
        console.log('Por favor, preencha todos os campos.');
    }
}

async function fetchFilmDetails(filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/filme/${filmeId}`);
        const filmDetails = await response.json();
        const detailsContainer = document.getElementById(`filmDetails-${filmeId}`);

        // Verificar se o container para os detalhes existe
        if (detailsContainer) {
            // Exibir detalhes do filme (diretor, sinopse e avaliação)
            detailsContainer.innerHTML = `
                <p><strong>Diretor:</strong> ${filmDetails.director}</p>
                <p><strong>Sinopse:</strong> ${filmDetails.synopsis}</p>
                <p><strong>Avaliação IMDb:</strong> ${filmDetails.rating}</p>
            `;
        } else {
            console.error('Container de detalhes não encontrado');
        }
    } catch (error) {
        console.log('Erro ao buscar detalhes do filme', error);
    }
}