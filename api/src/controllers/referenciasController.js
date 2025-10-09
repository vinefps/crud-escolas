const pool = require('../db/connection');

// Municipios
exports.listarMunicipios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM municipios ORDER BY nome');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar municípios' });
  }
};

// Diretorias
exports.listarDiretorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM diretorias ORDER BY nome');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar diretorias' });
  }
};

// Distritos
exports.listarDistritos = async (req, res) => {
  try {
    let query = 'SELECT id, nome FROM distritos';
    let params = [];

    if (req.query.municipio_id) {
      query = `
        SELECT DISTINCT d.id, d.nome 
        FROM distritos d
        JOIN escolas e ON d.id = e.distrito_id
        WHERE e.municipio_id = $1
      `;
      params = [req.query.municipio_id];
    }

    query += ' ORDER BY nome';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar distritos' });
  }
};

// Redes de ensino
exports.listarRedesEnsino = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM redes_ensino ORDER BY nome');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar redes' });
  }
};

// Tipos de escola
exports.listarTiposEscola = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, codigo, descricao FROM tipos_escola ORDER BY descricao');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar tipos' });
  }
};

// Situacoes
exports.listarSituacoes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, codigo FROM situacoes ORDER BY codigo');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar situações' });
  }
};