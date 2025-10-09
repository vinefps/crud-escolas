-- Deletar tabelas se existir
DROP TABLE IF EXISTS escolas;
DROP TABLE IF EXISTS situacoes;
DROP TABLE IF EXISTS tipos_escola;
DROP TABLE IF EXISTS distritos;
DROP TABLE IF EXISTS municipios;
DROP TABLE IF EXISTS diretorias;
DROP TABLE IF EXISTS redes_ensino;

-- Tabelas de referencia
CREATE TABLE redes_ensino (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE diretorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE municipios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE distritos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tipos_escola (
    id SERIAL PRIMARY KEY,
    codigo INTEGER NOT NULL UNIQUE,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE situacoes (
    id SERIAL PRIMARY KEY,
    codigo INTEGER NOT NULL UNIQUE
);

-- Tabela principal
CREATE TABLE escolas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    rede_ensino_id INTEGER REFERENCES redes_ensino(id),
    diretoria_id INTEGER REFERENCES diretorias(id),
    municipio_id INTEGER REFERENCES municipios(id),
    distrito_id INTEGER REFERENCES distritos(id),
    tipo_escola_id INTEGER REFERENCES tipos_escola(id),
    situacao_id INTEGER REFERENCES situacoes(id),
    salas_aula INTEGER DEFAULT 0,
    salas_ed_inf INTEGER DEFAULT 0,
    salas_ed_esp INTEGER DEFAULT 0,
    salas_ed_art INTEGER DEFAULT 0,
    sala_recurso INTEGER DEFAULT 0,
    tot_salas_aula INTEGER DEFAULT 0,
    auditorio INTEGER DEFAULT 0,
    anfiteatro INTEGER DEFAULT 0,
    teatro INTEGER DEFAULT 0,
    cantina INTEGER DEFAULT 0,
    copa INTEGER DEFAULT 0,
    cozinha INTEGER DEFAULT 0,
    refeitorio INTEGER DEFAULT 0,
    deposito_alimentos INTEGER DEFAULT 0,
    despensa INTEGER DEFAULT 0,
    tot_despensa INTEGER DEFAULT 0,
    sala_leitura INTEGER DEFAULT 0,
    biblioteca INTEGER DEFAULT 0,
    tot_sala_leitura INTEGER DEFAULT 0,
    quadra_coberta INTEGER DEFAULT 0,
    quadra_descoberta INTEGER DEFAULT 0,
    ginasio INTEGER DEFAULT 0,
    tot_quadra INTEGER DEFAULT 0,
    quadra_areia INTEGER DEFAULT 0,
    quadra_grama INTEGER DEFAULT 0,
    campo_futebol INTEGER DEFAULT 0,
    gabinete_dentario INTEGER DEFAULT 0,
    consultorio_medico INTEGER DEFAULT 0,
    enfermaria INTEGER DEFAULT 0,
    ambulatorio INTEGER DEFAULT 0,
    almoxarifado INTEGER DEFAULT 0,
    arquivo INTEGER DEFAULT 0,
    reprografia INTEGER DEFAULT 0,
    sala_gremio INTEGER DEFAULT 0,
    diretoria INTEGER DEFAULT 0,
    vicediretoria INTEGER DEFAULT 0,
    sala_prof INTEGER DEFAULT 0,
    secretaria INTEGER DEFAULT 0,
    sala_orient_ed INTEGER DEFAULT 0,
    sala_coord_pedag INTEGER DEFAULT 0,
    patio_coberto INTEGER DEFAULT 0,
    patio_descoberto INTEGER DEFAULT 0,
    zeladoria INTEGER DEFAULT 0,
    vestiario_fem INTEGER DEFAULT 0,
    vestiario_masc INTEGER DEFAULT 0,
    tot_vestiario INTEGER DEFAULT 0,
    videoteca INTEGER DEFAULT 0,
    sala_tv INTEGER DEFAULT 0,
    lab_info INTEGER DEFAULT 0,
    lab_ciencias INTEGER DEFAULT 0,
    lab_fisica INTEGER DEFAULT 0,
    lab_quimica INTEGER DEFAULT 0,
    lab_biologia INTEGER DEFAULT 0,
    lab_ciencia_fisica_biologica INTEGER DEFAULT 0,
    tot_lab_ciencia INTEGER DEFAULT 0,
    lab_linguas INTEGER DEFAULT 0,
    lab_multiuso INTEGER DEFAULT 0,
    oficina INTEGER DEFAULT 0,
    playground INTEGER DEFAULT 0,
    dormitorio INTEGER DEFAULT 0,
    bercario INTEGER DEFAULT 0,
    sanitario_adeq_pre INTEGER DEFAULT 0,
    sanitario_adeq_pre_fem INTEGER DEFAULT 0,
    sanitario_adeq_pre_masc INTEGER DEFAULT 0,
    sanitario_adeq_def INTEGER DEFAULT 0,
    sanitario_adeq_def_fem INTEGER DEFAULT 0,
    sanitario_adeq_def_masc INTEGER DEFAULT 0,
    sanitario_al_masc INTEGER DEFAULT 0,
    sanitario_al_fem INTEGER DEFAULT 0,
    tot_sanitario_al INTEGER DEFAULT 0,
    sanitario_func_fem INTEGER DEFAULT 0,
    sanitario_func_masc INTEGER DEFAULT 0,
    tot_sanitario_func INTEGER DEFAULT 0,
    depend_adeq_def INTEGER DEFAULT 0,
    sala_ed_fisica INTEGER DEFAULT 0,
    piscina INTEGER DEFAULT 0,
    portaria INTEGER DEFAULT 0,
    sala_prog_esc_familia INTEGER DEFAULT 0,
    brinquedoteca INTEGER DEFAULT 0,
    fraldario INTEGER DEFAULT 0,
    lactario INTEGER DEFAULT 0,
    lavanderia INTEGER DEFAULT 0,
    solario INTEGER DEFAULT 0,
    sala_espera INTEGER DEFAULT 0,
    sala_inspetor INTEGER DEFAULT 0,
    sala_reuniao INTEGER DEFAULT 0,
    tesouraria INTEGER DEFAULT 0,
    sala_reforco INTEGER DEFAULT 0,
    sala_diretor_tecnico INTEGER DEFAULT 0,
    garagem_onibus INTEGER DEFAULT 0,
    sala_fisioterapia INTEGER DEFAULT 0,
    sala_psicologia INTEGER DEFAULT 0,
    sala_fonoaudiologia INTEGER DEFAULT 0,
    sala_eventos INTEGER DEFAULT 0,
    sala_assist_social INTEGER DEFAULT 0,
    sala_terapia_educ INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alguns indices basicos
CREATE INDEX idx_codigo ON escolas(codigo);
CREATE INDEX idx_municipio ON escolas(municipio_id);