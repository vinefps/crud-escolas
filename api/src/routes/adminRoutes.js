const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarAuth } = require('../middlewares/authMiddleware');

// Rota protegida para deletar todos os dados
router.delete('/deletar-tudo', verificarAuth, adminController.deletarTodosDados);

module.exports = router;