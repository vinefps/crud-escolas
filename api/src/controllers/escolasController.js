const pool = require('../db/connection');

// Listar escolas
exports.listarEscolas = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        e.id, e.codigo, e.nome,
        e.rede_ensino_id, e.diretoria_id, e.municipio_id,
        e.distrito_id, e.tipo_escola_id, e.situacao_id,
        r.nome as rede_ensino,
        d.nome as diretoria,
        m.nome as municipio,
        dist.nome as distrito,
        te.descricao as tipo_escola,
        s.codigo as situacao,
        e.salas_aula, e.biblioteca, e.quadra_coberta, e.lab_info
      FROM escolas e
      JOIN redes_ensino r ON e.rede_ensino_id = r.id
      JOIN diretorias d ON e.diretoria_id = d.id
      JOIN municipios m ON e.municipio_id = m.id
      JOIN distritos dist ON e.distrito_id = dist.id
      JOIN tipos_escola te ON e.tipo_escola_id = te.id
      JOIN situacoes s ON e.situacao_id = s.id
    `;

    let params = [];
    let whereClause = '';
    let paramCount = 1;

    // Filtros
    if (req.query.municipio_id) {
      whereClause += `e.municipio_id = $${paramCount} AND `;
      params.push(req.query.municipio_id);
      paramCount++;
    }

    if (req.query.diretoria_id) {
      whereClause += `e.diretoria_id = $${paramCount} AND `;
      params.push(req.query.diretoria_id);
      paramCount++;
    }

    if (req.query.search) {
      whereClause += `(e.nome ILIKE $${paramCount} OR e.codigo ILIKE $${paramCount}) AND `;
      params.push(`%${req.query.search}%`);
      paramCount++;
    }

    if (whereClause) {
      whereClause = whereClause.slice(0, -5); // Remove o ultimo " AND "
      query += ` WHERE ${whereClause}`;
    }

    query += ` ORDER BY e.nome LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM escolas e';
    if (whereClause) {
      countQuery += ` WHERE ${whereClause}`;
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar escolas' });
  }
};

// Buscar escola por ID
exports.buscarEscolaPorId = async (req, res) => {
  try {
    const id = req.params.id;

    const query = `
      SELECT 
        e.*,
        r.nome as rede_ensino,
        d.nome as diretoria,
        m.nome as municipio,
        dist.nome as distrito,
        te.descricao as tipo_escola,
        s.codigo as situacao
      FROM escolas e
      JOIN redes_ensino r ON e.rede_ensino_id = r.id
      JOIN diretorias d ON e.diretoria_id = d.id
      JOIN municipios m ON e.municipio_id = m.id
      JOIN distritos dist ON e.distrito_id = dist.id
      JOIN tipos_escola te ON e.tipo_escola_id = te.id
      JOIN situacoes s ON e.situacao_id = s.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Escola não encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar escola' });
  }
};

// Criar escola
exports.criarEscola = async (req, res) => {
  try {
    const {
      codigo, nome, rede_ensino_id, diretoria_id, municipio_id,
      distrito_id, tipo_escola_id, situacao_id, salas_aula, biblioteca,
      quadra_coberta, lab_info
    } = req.body;

    // Verificar se codigo ja existe
    const check = await pool.query('SELECT id FROM escolas WHERE codigo = $1', [codigo]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Código já existe' });
    }

    const query = `
      INSERT INTO escolas 
      (codigo, nome, rede_ensino_id, diretoria_id, municipio_id, distrito_id, tipo_escola_id, situacao_id, salas_aula, biblioteca, quadra_coberta, lab_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await pool.query(query, [
      codigo, nome, rede_ensino_id, diretoria_id, municipio_id,
      distrito_id, tipo_escola_id, situacao_id, salas_aula || 0,
      biblioteca || 0, quadra_coberta || 0, lab_info || 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Escola criada',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar escola' });
  }
};

// Atualizar escola
exports.atualizarEscola = async (req, res) => {
  try {
    const id = req.params.id;
    const dados = req.body;

    // Verificar se existe
    const check = await pool.query('SELECT id FROM escolas WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Escola não encontrada' });
    }

    // Montar query de update
    const campos = Object.keys(dados);
    const valores = Object.values(dados);

    let setClauses = [];
    for (let i = 0; i < campos.length; i++) {
      setClauses.push(`${campos[i]} = $${i + 1}`);
    }

    const query = `
      UPDATE escolas 
      SET ${setClauses.join(', ')}
      WHERE id = $${campos.length + 1}
      RETURNING *
    `;

    valores.push(id);
    const result = await pool.query(query, valores);

    res.json({
      success: true,
      message: 'Escola atualizada',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar escola' });
  }
};

// Deletar escola
exports.deletarEscola = async (req, res) => {
  try {
    const id = req.params.id;

    const check = await pool.query('SELECT nome FROM escolas WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Escola não encontrada' });
    }

    await pool.query('DELETE FROM escolas WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Escola deletada',
      data: { id: id, nome: check.rows[0].nome }
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar escola' });
  }
};

// Estatisticas
exports.obterEstatisticas = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_escolas,
        COUNT(DISTINCT municipio_id) as total_municipios,
        COUNT(DISTINCT diretoria_id) as total_diretorias,
        SUM(salas_aula) as total_salas_aula,
        AVG(salas_aula) as media_salas_por_escola
      FROM escolas
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter estatísticas' });
  }
};