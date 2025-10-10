require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
const escolasRoutes = require('./routes/escolasRoutes');
const referenciasRoutes = require('./routes/referenciasRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');  // ← ADICIONAR

// Usar rotas
app.use('/api/escolas', escolasRoutes);
app.use('/api/referencias', referenciasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);  // ← ADICIONAR

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API de Escolas - Rodando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});