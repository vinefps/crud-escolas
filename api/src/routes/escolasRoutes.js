const express = require('express');
const router = express.Router();
const escolasController = require('../controllers/escolasController');
const uploadController = require('../controllers/uploadController');
const { verificarAuth } = require('../middlewares/authMiddleware');  // ← IMPORTAR

/**
 * Rotas para o CRUD de Escolas
 * Base: /api/escolas
 */


// ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)


// GET /api/escolas/stats - Estatísticas (pública)
router.get('/stats', escolasController.obterEstatisticas);

// GET /api/escolas - Listar escolas (pública)
router.get('/', escolasController.listarEscolas);

// GET /api/escolas/:id - Buscar escola por ID (pública)
router.get('/:id', escolasController.buscarEscolaPorId);


// ROTAS PROTEGIDAS (COM AUTENTICAÇÃO)


// POST /api/escolas/upload-csv - Upload de CSV (PROTEGIDA)
router.post('/upload-csv', verificarAuth, uploadController.uploadCSV);

// POST /api/escolas - Criar nova escola (PROTEGIDA)
router.post('/', verificarAuth, escolasController.criarEscola);

// PUT /api/escolas/:id - Atualizar escola (PROTEGIDA)
router.put('/:id', verificarAuth, escolasController.atualizarEscola);

// DELETE /api/escolas/:id - Deletar escola (PROTEGIDA)
router.delete('/:id', verificarAuth, escolasController.deletarEscola);

module.exports = router;