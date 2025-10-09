const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db/connection');

// Configurar multer para upload
const upload = multer({ dest: 'uploads/' });

// Funções auxiliares para buscar ou criar referências
async function buscarOuCriarRede(nome) {
    if (!nome || nome.trim() === '') return null;

    const result = await pool.query(
        'INSERT INTO redes_ensino (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
        [nome.trim()]
    );
    return result.rows[0].id;
}

async function buscarOuCriarDiretoria(nome) {
    if (!nome || nome.trim() === '') return null;

    const result = await pool.query(
        'INSERT INTO diretorias (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
        [nome.trim()]
    );
    return result.rows[0].id;
}

async function buscarOuCriarMunicipio(nome) {
    if (!nome || nome.trim() === '') return null;

    const result = await pool.query(
        'INSERT INTO municipios (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
        [nome.trim()]
    );
    return result.rows[0].id;
}

async function buscarOuCriarDistrito(nome) {
    if (!nome || nome.trim() === '') return null;

    const result = await pool.query(
        'INSERT INTO distritos (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
        [nome.trim()]
    );
    return result.rows[0].id;
}

async function buscarOuCriarTipo(codigo, descricao) {
    if (!codigo || !descricao) return null;

    const result = await pool.query(
        'INSERT INTO tipos_escola (codigo, descricao) VALUES ($1, $2) ON CONFLICT (codigo) DO UPDATE SET descricao = $2 RETURNING id',
        [parseInt(codigo), descricao.trim()]
    );
    return result.rows[0].id;
}

async function buscarOuCriarSituacao(codigo) {
    if (!codigo) return null;

    const result = await pool.query(
        'INSERT INTO situacoes (codigo) VALUES ($1) ON CONFLICT (codigo) DO UPDATE SET codigo = $1 RETURNING id',
        [parseInt(codigo)]
    );
    return result.rows[0].id;
}

// Controller de upload
exports.uploadCSV = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo foi enviado'
            });
        }

        const filePath = req.file.path;
        const escolas = [];
        const erros = [];
        let totalSucesso = 0;

        try {
            // Ler CSV
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath, { encoding: 'utf8' })
                    .pipe(csv({ separator: ';' }))
                    .on('data', (row) => {
                        // Limpar BOM se existir
                        const cleanRow = {};
                        for (const key in row) {
                            const cleanKey = key.replace(/^\uFEFF/, '').trim();
                            cleanRow[cleanKey] = row[key];
                        }
                        escolas.push(cleanRow);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            console.log(`Total de linhas lidas: ${escolas.length}`);

            // Processar cada escola
            for (let i = 0; i < escolas.length; i++) {
                const row = escolas[i];

                try {
                    // Validar campos obrigatórios
                    if (!row.CODESC || !row.NOMESC) {
                        erros.push({
                            linha: i + 1,
                            codigo: row.CODESC || 'N/A',
                            erro: 'Campos obrigatórios faltando (CODESC ou NOMESC)'
                        });
                        continue;
                    }

                    // Buscar ou criar referências
                    const redeId = await buscarOuCriarRede(row.NOMEDEP);
                    const dirId = await buscarOuCriarDiretoria(row.DE);
                    const munId = await buscarOuCriarMunicipio(row.MUN);
                    const distId = await buscarOuCriarDistrito(row.DISTR);
                    const tipoId = await buscarOuCriarTipo(row.TIPOESC, row.TIPOESC_DESC);
                    const sitId = await buscarOuCriarSituacao(row.CODSIT);

                    // Verificar se todas as referências foram criadas
                    if (!redeId || !dirId || !munId || !distId || !tipoId || !sitId) {
                        erros.push({
                            linha: i + 1,
                            codigo: row.CODESC,
                            erro: 'Erro ao criar/buscar referências'
                        });
                        continue;
                    }

                    // Inserir escola
                    await pool.query(
                        `INSERT INTO escolas (
              codigo, nome, rede_ensino_id, diretoria_id, municipio_id, 
              distrito_id, tipo_escola_id, situacao_id, salas_aula, 
              biblioteca, quadra_coberta, lab_info
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (codigo) DO UPDATE SET
              nome = $2,
              rede_ensino_id = $3,
              diretoria_id = $4,
              municipio_id = $5,
              distrito_id = $6,
              tipo_escola_id = $7,
              situacao_id = $8,
              salas_aula = $9,
              biblioteca = $10,
              quadra_coberta = $11,
              lab_info = $12`,
                        [
                            row.CODESC.trim(),
                            row.NOMESC.trim(),
                            redeId,
                            dirId,
                            munId,
                            distId,
                            tipoId,
                            sitId,
                            parseInt(row.SALAS_AULA) || 0,
                            parseInt(row.BIBLIOTECA) || 0,
                            parseInt(row.QUADRA_COBERTA) || 0,
                            parseInt(row.LAB_INFO) || 0
                        ]
                    );

                    totalSucesso++;

                    // Log a cada 100 escolas
                    if (totalSucesso % 100 === 0) {
                        console.log(`Processadas: ${totalSucesso} escolas`);
                    }

                } catch (err) {
                    console.error(`Erro na linha ${i + 1}:`, err.message);
                    erros.push({
                        linha: i + 1,
                        codigo: row.CODESC || 'N/A',
                        erro: err.message
                    });
                }
            }

            // Deletar arquivo temporário
            fs.unlinkSync(filePath);

            // Retornar resultado
            res.json({
                success: true,
                message: `Upload concluído com sucesso`,
                resultado: {
                    total: escolas.length,
                    sucesso: totalSucesso,
                    erros: erros.length,
                    detalhesErros: erros.slice(0, 10) // Apenas os 10 primeiros erros
                }
            });

        } catch (error) {
            // Deletar arquivo em caso de erro
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            console.error('Erro ao processar CSV:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao processar CSV',
                erro: error.message
            });
        }
    }
];