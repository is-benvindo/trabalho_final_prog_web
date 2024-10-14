const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // ajuste o caminho conforme necessário
const authenticateToken = require('../middlewares/authMiddlewares'); // middleware de autenticação
const router = express.Router();

// Rota de registro (não requer autenticação)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Dados de registro recebidos:', req.body); // Log dos dados recebidos

    try {
        const user = await registerUser(username, email, password);
        res.status(201).json({ user });
    } catch (error) {
        console.error('Erro no registro:', error.message); // Log do erro
        res.status(400).json({ error: error.message });
    }
});

// Rota de login (não requer autenticação)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Dados de login recebidos:', req.body); // Log dos dados recebidos

    try {
        const token = await loginUser(email, password);
        res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error.message); // Log do erro
        res.status(400).json({ error: error.message });
    }
});


// Exemplo de rota protegida (requer autenticação)
router.get('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id; // O middleware decodificou o token e colocou os dados do usuário no req.user

    // Lógica para buscar o perfil do usuário vai aqui...
    res.json({ message: `Este é o perfil do usuário com ID ${userId}` });
});

module.exports = router;