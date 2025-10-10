import axios from 'axios';

// URL base da sua API backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// INTERCEPTOR - ADICIONAR TOKEN AUTOMATICAMENTE

api.interceptors.request.use(
  (config) => {
    // Pegar token do localStorage
    const token = localStorage.getItem('token');

    // Se tiver token, adicionar no header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ERRO 401 (NÃO AUTORIZADO)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se retornar 401, significa que o token expirou/inválido
    if (error.response?.status === 401) {
      // Limpar autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // Recarregar página (vai voltar pro login)
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

// Funções para o CRUD de Escolas
export const escolasAPI = {
  // Listar todas as escolas (com paginação e filtros)
  listarTodas: async (params = {}) => {
    const response = await api.get('/escolas', { params });
    return response.data;
  },

  // Buscar escola por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/escolas/${id}`);
    return response.data;
  },

  // Criar nova escola (PROTEGIDA - precisa de token)
  criar: async (escola) => {
    const response = await api.post('/escolas', escola);
    return response.data;
  },

  // Atualizar escola (PROTEGIDA - precisa de token)
  atualizar: async (id, escola) => {
    const response = await api.put(`/escolas/${id}`, escola);
    return response.data;
  },

  // Deletar escola (PROTEGIDA - precisa de token)
  deletar: async (id) => {
    const response = await api.delete(`/escolas/${id}`);
    return response.data;
  },

  // Estatísticas
  obterEstatisticas: async () => {
    const response = await api.get('/escolas/stats');
    return response.data;
  },
};

// Funções para Referências (municípios, diretorias, etc)
export const referenciasAPI = {
  // Listar municípios
  listarMunicipios: async () => {
    const response = await api.get('/referencias/municipios');
    return response.data;
  },

  // Listar diretorias
  listarDiretorias: async () => {
    const response = await api.get('/referencias/diretorias');
    return response.data;
  },

  // Listar distritos
  listarDistritos: async (municipioId = null) => {
    const params = municipioId ? { municipio_id: municipioId } : {};
    const response = await api.get('/referencias/distritos', { params });
    return response.data;
  },

  // Listar redes de ensino
  listarRedesEnsino: async () => {
    const response = await api.get('/referencias/redes-ensino');
    return response.data;
  },

  // Listar tipos de escola
  listarTiposEscola: async () => {
    const response = await api.get('/referencias/tipos-escola');
    return response.data;
  },

  // Listar situações
  listarSituacoes: async () => {
    const response = await api.get('/referencias/situacoes');
    return response.data;
  },
};

// ← ADICIONAR OBJETO adminAPI AQUI
export const adminAPI = {
  // Deletar todos os dados
  deletarTodosDados: async () => {
    const response = await api.delete('/admin/deletar-tudo');
    return response.data;
  },
};

export default api;