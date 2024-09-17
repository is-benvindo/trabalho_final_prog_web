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
            <div class="post" onclick="openFilmModal('${post.id}')">
                <img src="${post.poster}" alt="${post.title} Poster" class="poster">
                <div class="post-info">
                    <h2>${post.title}</h2>
                    <p><strong>Ano:</strong> ${post.year}</p>
                    <button onclick="showCommentForm('${post.id}')">Adicionar Comentário</button>
                    <div id="comments-${post.id}" class="comments"></div>
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
                    <button onclick="editComment('${comment.id}', '${postId}')">Editar</button>
                    <button onclick="deleteComment('${comment.id}', '${postId}')">Excluir</button>
                    <button onclick="showReplyForm('${comment.id}', '${postId}')">Responder</button>
                    <div id="replies-${comment.id}" class="comments"></div>
                </div>
            `).join('');

            // Carregar respostas para cada comentário
            comments.forEach(comment => loadReplies(comment.id));
        }
    } catch (error) {
        console.log('Erro ao carregar comentários', error);
    }
}

async function loadReplies(commentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/respostas/${commentId}`);
        const replies = await response.json();
        const repliesContainer = document.getElementById(`replies-${commentId}`);

        if (repliesContainer) {
            repliesContainer.innerHTML = replies.map(reply => `
                <div class="comment">
                    <p><strong>${reply.autor}:</strong> ${reply.texto}</p>
                    <button onclick="editComment('${reply.id}')">Editar</button>
                    <button onclick="deleteComment('${reply.id}')">Excluir</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.log('Erro ao carregar respostas', error);
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

async function editComment(commentId, postId) {
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
                loadComments(postId); // Recarregar comentários após editar
            } else {
                console.log('Erro ao atualizar comentário');
            }
        } catch (error) {
            console.log('Erro ao atualizar comentário', error);
        }
    }
}

async function deleteComment(commentId, postId) {
    try {
        const response = await fetch(`http://localhost:3000/api/comentarios/${commentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadComments(postId); // Recarregar comentários após excluir
        } else {
            console.log('Erro ao excluir comentário');
        }
    } catch (error) {
        console.log('Erro ao excluir comentário', error);
    }
}

function showReplyForm(commentId, postId) {
    const formHtml = `
        <div>
            <input type="text" id="replyAuthor-${commentId}" placeholder="Seu nome">
            <textarea id="replyText-${commentId}" placeholder="Sua resposta"></textarea>
            <button onclick="submitReply('${commentId}', '${postId}')">Enviar Resposta</button>
        </div>
    `;
    document.getElementById(`replies-${commentId}`).innerHTML = formHtml;
}

async function submitReply(commentId, postId) {
    const author = document.getElementById(`replyAuthor-${commentId}`).value;
    const text = document.getElementById(`replyText-${commentId}`).value;
    if (author && text) {
        try {
            const response = await fetch('http://localhost:3000/api/comentarios/respostas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comentarioId: commentId, autor: author, texto: text })
            });

            if (response.ok) {
                loadReplies(commentId); // Recarregar respostas após adicionar
                loadComments(postId); // Recarregar comentários após adicionar resposta
            } else {
                console.log('Erro ao adicionar resposta');
            }
        } catch (error) {
            console.log('Erro ao adicionar resposta', error);
        }
    } else {
        console.log('Por favor, preencha todos os campos.');
    }
}

async function fetchFilmDetails(filmeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/filme/${filmeId}`);
        const filmDetails = await response.json();
        const modalContent = document.querySelector('.modal-content');

        if (modalContent) {
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <p><strong>Título:</strong> ${filmDetails.title}</p>
                <p><strong>Diretor:</strong> ${filmDetails.director}</p>
                <p><strong>Sinopse:</strong> ${filmDetails.synopsis}</p>
                <p><strong>Avaliação IMDb:</strong> ${filmDetails.rating}</p>
                <img src="${filmDetails.poster}" alt="${filmDetails.title} Poster" class="poster">
                <div class="comment-form">
                    <input type="text" id="commentAuthorModal" placeholder="Seu nome">
                    <textarea id="commentTextModal" placeholder="Seu comentário"></textarea>
                    <button onclick="submitCommentModal('${filmeId}')">Enviar Comentário</button>
                </div>
            `;
            document.getElementById('myModal').style.display = 'block';
        } else {
            console.error('Conteúdo do modal não encontrado');
        }
    } catch (error) {
        console.log('Erro ao buscar detalhes do filme', error);
    }
}

function submitCommentModal(filmeId) {
    const author = document.getElementById('commentAuthorModal').value;
    const text = document.getElementById('commentTextModal').value;
    if (author && text) {
        addComment(filmeId, author, text);
        document.getElementById('commentAuthorModal').value = '';
        document.getElementById('commentTextModal').value = '';
    } else {
        console.log('Por favor, preencha todos os campos.');
    }
}


function openFilmModal(filmeId) {
    fetchFilmDetails(filmeId);
}