import React, { useState } from 'react';
import { login } from '../services/auth';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await login(email, senha);
      
      if (response.success) {
        onLoginSuccess(response.data.usuario);
      }
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🏫 CRUD Escolas</h1>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {erro}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Credenciais */}
        <div className="mt-6 p-3 bg-gray-100 rounded text-sm">
          <p className="font-bold mb-1">Credenciais de teste:</p>
          <p>Email: admin@escola.com</p>
          <p>Senha: admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;