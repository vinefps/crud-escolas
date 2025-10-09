const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
  // Configurações de performance
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Fechar conexões inativas após 30s
  connectionTimeoutMillis: 2000, // Timeout de 2s para novas conexões
});

// Event listeners para debug
pool.on('connect', () => {
  console.log(' Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
  process.exit(-1);
});

// Testar conexão ao iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(' Erro ao conectar com o banco:', err);
  } else {
    console.log('  Banco de dados conectado em:', res.rows[0].now);
  }
});

module.exports = pool;
