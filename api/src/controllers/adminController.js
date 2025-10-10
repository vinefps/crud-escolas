const pool = require('../db/connection');

/**
 * DELETAR TODOS OS DADOS DO BANCO
 */
exports.deletarTodosDados = async (req, res) => {
    try {
        // Deletar em ordem (por causa das foreign keys)
        await pool.query('DELETE FROM escolas');
        await pool.query('DELETE FROM situacoes');
        await pool.query('DELETE FROM tipos_escola');
        await pool.query('DELETE FROM distritos');
        await pool.query('DELETE FROM municipios');
        await pool.query('DELETE FROM diretorias');
        await pool.query('DELETE FROM redes_ensino');

        // Resetar as sequences (IDs voltam para 1)
        await pool.query('ALTER SEQUENCE escolas_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE situacoes_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE tipos_escola_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE distritos_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE municipios_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE diretorias_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE redes_ensino_id_seq RESTART WITH 1');

        res.json({
            success: true,
            message: 'Todos os dados foram deletados com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao deletar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar dados',
            erro: error.message
        });
    }
};