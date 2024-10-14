const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401); // Se não houver token, retorna 401

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token for inválido, retorna 403
        req.user = user; // Armazena o usuário na requisição
        next();
    });
};

module.exports = authenticateToken;