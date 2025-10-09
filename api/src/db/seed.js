const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'escolas',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

const escolas = [];
const redesSet = new Set();
const diretoriasSet = new Set();
const municipiosSet = new Set();
const distritosSet = new Set();
const tiposMap = new Map();
const situacoesSet = new Set();

console.log('Lendo CSV...');

fs.createReadStream('../data/Escola_Dependencias_062025.csv', { encoding: 'utf8' })
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        // Limpar BOM
        const cleanRow = {};
        for (const key in row) {
            const cleanKey = key.replace(/^\uFEFF/, '').trim();
            cleanRow[cleanKey] = row[key];
        }

        if (!cleanRow.CODESC || !cleanRow.NOMESC) return;

        escolas.push(cleanRow);

        if (cleanRow.NOMEDEP) redesSet.add(cleanRow.NOMEDEP.trim());
        if (cleanRow.DE) diretoriasSet.add(cleanRow.DE.trim());
        if (cleanRow.MUN) municipiosSet.add(cleanRow.MUN.trim());
        if (cleanRow.DISTR) distritosSet.add(cleanRow.DISTR.trim());

        const tipoCod = parseInt(cleanRow.TIPOESC);
        if (tipoCod && cleanRow.TIPOESC_DESC) {
            tiposMap.set(tipoCod, cleanRow.TIPOESC_DESC.trim());
        }

        const sitCod = parseInt(cleanRow.CODSIT);
        if (sitCod) situacoesSet.add(sitCod);
    })
    .on('end', async () => {
        console.log('CSV lido!');
        console.log('Total de linhas:', escolas.length);
        console.log('Redes:', redesSet.size);
        console.log('Diretorias:', diretoriasSet.size);
        console.log('Municipios:', municipiosSet.size);

        try {
            // Inserir redes
            console.log('\nInserindo redes...');
            const redesIds = {};
            for (const nome of redesSet) {
                const result = await pool.query(
                    'INSERT INTO redes_ensino (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
                    [nome]
                );
                redesIds[nome] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(redesIds).length, 'redes');

            // Inserir diretorias
            console.log('Inserindo diretorias...');
            const diretoriasIds = {};
            for (const nome of diretoriasSet) {
                const result = await pool.query(
                    'INSERT INTO diretorias (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
                    [nome]
                );
                diretoriasIds[nome] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(diretoriasIds).length, 'diretorias');

            // Inserir municipios
            console.log('Inserindo municipios...');
            const municipiosIds = {};
            for (const nome of municipiosSet) {
                const result = await pool.query(
                    'INSERT INTO municipios (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
                    [nome]
                );
                municipiosIds[nome] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(municipiosIds).length, 'municipios');

            // Inserir distritos
            console.log('Inserindo distritos...');
            const distritosIds = {};
            for (const nome of distritosSet) {
                const result = await pool.query(
                    'INSERT INTO distritos (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = $1 RETURNING id',
                    [nome]
                );
                distritosIds[nome] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(distritosIds).length, 'distritos');

            // Inserir tipos
            console.log('Inserindo tipos...');
            const tiposIds = {};
            for (const [codigo, desc] of tiposMap.entries()) {
                const result = await pool.query(
                    'INSERT INTO tipos_escola (codigo, descricao) VALUES ($1, $2) ON CONFLICT (codigo) DO UPDATE SET descricao = $2 RETURNING id',
                    [codigo, desc]
                );
                tiposIds[codigo] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(tiposIds).length, 'tipos');

            // Inserir situacoes
            console.log('Inserindo situacoes...');
            const situacoesIds = {};
            for (const codigo of situacoesSet) {
                const result = await pool.query(
                    'INSERT INTO situacoes (codigo) VALUES ($1) ON CONFLICT (codigo) DO UPDATE SET codigo = $1 RETURNING id',
                    [codigo]
                );
                situacoesIds[codigo] = result.rows[0].id;
            }
            console.log('OK -', Object.keys(situacoesIds).length, 'situacoes');

            // Inserir escolas
            console.log('\nInserindo escolas...');
            let count = 0;
            let erros = 0;

            for (const row of escolas) {
                try {
                    const redeId = redesIds[row.NOMEDEP?.trim()];
                    const dirId = diretoriasIds[row.DE?.trim()];
                    const munId = municipiosIds[row.MUN?.trim()];
                    const distId = distritosIds[row.DISTR?.trim()];
                    const tipoId = tiposIds[parseInt(row.TIPOESC)];
                    const sitId = situacoesIds[parseInt(row.CODSIT)];

                    if (!redeId || !dirId || !munId || !distId || !tipoId || !sitId) {
                        erros++;
                        continue;
                    }

                    await pool.query(
                        `INSERT INTO escolas (codigo, nome, rede_ensino_id, diretoria_id, municipio_id, distrito_id, tipo_escola_id, situacao_id, salas_aula, biblioteca, quadra_coberta, lab_info) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                         ON CONFLICT (codigo) DO NOTHING`,
                        [
                            row.CODESC,
                            row.NOMESC,
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

                    count++;
                    if (count % 500 === 0) {
                        console.log(count, 'escolas...');
                    }
                } catch (err) {
                    erros++;
                }
            }

            console.log('\nPronto!');
            console.log('Escolas inseridas:', count);
            if (erros > 0) {
                console.log('Linhas com erro:', erros);
            }

            await pool.end();
            process.exit(0);

        } catch (error) {
            console.error('Erro:', error.message);
            await pool.end();
            process.exit(1);
        }
    });