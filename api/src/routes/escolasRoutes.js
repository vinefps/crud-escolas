const express = require('express');
const router = express.Router();
const escolasController = require('../controllers/escolasController');
const uploadController = require('../controllers/uploadController');

/**
 * Rotas para o CRUD de Escolas
 * Base: /api/escolas
 */

// POST /api/escolas/upload-csv - Upload de CSV (ANTES das outras rotas)
router.post('/upload-csv', uploadController.uploadCSV);

// GET /api/escolas/stats - Estatísticas
router.get('/stats', escolasController.obterEstatisticas);

// GET /api/escolas - Listar escolas
router.get('/', escolasController.listarEscolas);

// GET /api/escolas/:id - Buscar escola por ID
router.get('/:id', escolasController.buscarEscolaPorId);

// POST /api/escolas - Criar nova escola
router.post('/', escolasController.criarEscola);

// PUT /api/escolas/:id - Atualizar escola
router.put('/:id', escolasController.atualizarEscola);

// DELETE /api/escolas/:id - Deletar escola
router.delete('/:id', escolasController.deletarEscola);

module.exports = router;