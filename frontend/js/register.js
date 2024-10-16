document.addEventListener('DOMContentLoaded', function () {
    const btnSubmit = document.getElementById('btnSubmit');
    const btnLogin = document.getElementById('btnLogin');

    if (btnLogin) {
        btnLogin.addEventListener('click', function () {
            window.location.href = './login.html';
        });
    }

    btnSubmit.addEventListener('click', sendForm);
});

// Função para fazer enviar o formulário
async function sendForm() {
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (validateForm()) {
                registerUser(username, email, password);
            }
        });
    }
}

// Função para fazer cadastro de usuário
async function registerUser(username, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Usuário registrado com sucesso:', data.user);
            console.log(data.user); // Retorna os dados do usuário registrado

            // Redireciona o usuário para a página inicial
            window.location.href = './login.html';
        } else {
            console.error('Erro no registro:', data.error);
        }
    } catch (error) {
        console.error('Erro de conexão no registro:', error);
    }
}

// Função para validar o formulário de login
function validateForm() {
    let isValid = true;

    // Validação do nome de usuário
    const username = document.getElementById('username').value.trim();
    const usernameError = document.getElementById('usernameError');
    if (username.textContent = '' || username.length < 4) {
        usernameError.textContent = "O nome de usuário deve ter pelo menos 4 caracteres.";
        isValid = false;
    } else {
        usernameError.textContent = "";
    }

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
