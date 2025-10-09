const express = require('express');
const router = express.Router();
const referenciasController = require('../controllers/referenciasController');

/**
 * Rotas para tabelas de referência
 * Base: /api/referencias
 */

// GET /api/referencias/municipios
router.get('/municipios', referenciasController.listarMunicipios);

// GET /api/referencias/diretorias
router.get('/diretorias', referenciasController.listarDiretorias);

// GET /api/referencias/distritos
router.get('/distritos', referenciasController.listarDistritos);

// GET /api/referencias/redes-ensino
router.get('/redes-ensino', referenciasController.listarRedesEnsino);

// GET /api/referencias/tipos-escola
router.get('/tipos-escola', referenciasController.listarTiposEscola);

// GET /api/referencias/situacoes
router.get('/situacoes', referenciasController.listarSituacoes);

module.exports = router;
