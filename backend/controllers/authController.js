const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET;

// Função para registrar um usuário
const registerUser = async (username, email, password) => {
    // Hash a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, username }])
        .select(); // Adicionando select para retornar o registro inserido

    if (error) throw error;

    return data[0]; // Retorna o primeiro registro inserido
};

// Função para autenticar um usuário
const loginUser = async (email, password) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) throw new Error('Usuário não encontrado');

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) throw new Error('Senha incorreta');

    // Gera o token JWT
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '1h' });

    return token;
};

// Exporta as funções
module.exports = { registerUser, loginUser };