const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar conexão com banco (vai conectar automaticamente)
require('./db/connection');

// Importar rotas
const escolasRoutes = require('./src/routes/escolasRoutes');
const referenciasRoutes = require('./src/routes/referenciasRoutes');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================

// CORS - permitir requisições do frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://seu-dominio.com'
    : '*', // Em desenvolvimento, aceita de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser de JSON
app.use(express.json());

// Parser de URL encoded
app.use(express.urlencoded({ extended: true }));

// Middleware de log de requisições (em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}


// ROTAS


// Rota raiz - health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gerenciamento de Escolas - CRUD',
    version: '1.0.0',
    endpoints: {
      escolas: '/api/escolas',
      referencias: '/api/referencias',
      docs: '/api/docs'
    }
  });
});

// Rota de documentação simples
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    documentation: {
      escolas: {
        'GET /api/escolas': 'Lista escolas (query params: page, limit, municipio_id, diretoria_id, tipo_escola_id, situacao_id, search)',
        'GET /api/escolas/stats': 'Estatísticas gerais',
        'GET /api/escolas/:id': 'Busca escola por ID',
        'POST /api/escolas': 'Cria nova escola',
        'PUT /api/escolas/:id': 'Atualiza escola',
        'DELETE /api/escolas/:id': 'Deleta escola'
      },
      referencias: {
        'GET /api/referencias/municipios': 'Lista municípios',
        'GET /api/referencias/diretorias': 'Lista diretorias',
        'GET /api/referencias/distritos': 'Lista distritos',
        'GET /api/referencias/redes-ensino': 'Lista redes de ensino',
        'GET /api/referencias/tipos-escola': 'Lista tipos de escola',
        'GET /api/referencias/situacoes': 'Lista situações'
      }
    }
  });
});

// Rotas da API
app.use('/api/escolas', escolasRoutes);
app.use('/api/referencias', referenciasRoutes);

// ========================================
// TRATAMENTO DE ERROS
// ========================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// INICIAR SERVIDOR


app.listen(PORT, () => {
  console.log('\n🚀 Servidor rodando!');
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api/docs\n`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
