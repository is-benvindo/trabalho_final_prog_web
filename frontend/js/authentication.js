document.addEventListener('DOMContentLoaded', function() {
    
});


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
            return data.user; // Retorna os dados do usuário registrado
        } else {
            console.error('Erro no registro:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Erro de conexão no registro:', error);
        return null;
    }
}


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
