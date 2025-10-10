import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fazer login
 */
export const login = async (email, senha) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senha
    });

    if (response.data.success) {
        // Salvar no localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }

    return response.data;
};

/**
 * Fazer logout
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
};

/**
 * Verificar se está logado
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Pegar usuário logado
 */
export const getUser = () => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
};