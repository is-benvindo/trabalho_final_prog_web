document.addEventListener('DOMContentLoaded', function () {
    const btnSubmit = document.getElementById('btnSubmit');
    const btnRegister = document.getElementById('btnRegister');

    if (btnRegister) {
        btnRegister.addEventListener('click', function () {
            window.location.href = './register.html';
        });
    }

    btnSubmit.addEventListener('click', sendForm);
});

// Função para fazer enviar o formulário
async function sendForm() {
    if (btnSubmit) {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (validateForm()) {
            registerUser(email, password);
        }
    }
}

// Função para fazer login de usuário
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.token;
            console.log('Login bem-sucedido, token JWT:', token);
            localStorage.setItem('token', token); // Armazena o token localmente, se necessário

            // Redireciona o usuário para a página inicial
            window.location.href = './index.html';
        } else {
            console.error('Erro no login:', data.error);
        }
    } catch (error) {
        console.error('Erro de conexão no login:', error);
    }
}

// Função para obter o perfil do usuário
async function getUserProfile() {
    try {
        const token = localStorage.getItem('token'); // Obtenha o token armazenado no login

        if (!token) {
            console.error('Nenhuma conta encontrado. Faça o login novamente.');
            return null;
        }

        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Perfil do usuário:', data);
            return data; // Retorna os dados do perfil
        } else {
            console.error('Erro ao obter o perfil:', data);
            return null;
        }
    } catch (error) {
        console.error('Erro de conexão ao obter o perfil:', error);
        return null;
    }
}


function logoutUser() {
    localStorage.removeItem('token'); // Remove o token JWT do armazenamento local
    console.log('Usuário deslogado');
}

// Função para validar o formulário de login
function validateForm() {
    let isValid = true;

    // Validação do email
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    if (email.textContent = '' || !/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Por favor, insira um email válido.";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

    // Validação da senha
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    if (password.length < 4 || !/\d/.test(password)) {
        passwordError.textContent = "A senha deve ter pelo menos 4 caracteres e incluir números.";
        isValid = false;
    } else {
        passwordError.textContent = "";
    }

    return isValid;
}
