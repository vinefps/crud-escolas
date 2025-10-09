# API de Gerenciamento de Escolas

Sistema que fiz para gerenciar dados de escolas usando Node.js e PostgreSQL.

## Tecnologias

- Node.js + Express
- PostgreSQL
- CSV parsing

## O que tem aqui

- CRUD completo de escolas
- Busca e filtros
- Dados vem de um CSV com mais de 5000 escolas
- API REST com Express

## 📋 Funcionalidades

- CRUD completo de escolas
- Busca e filtros (município, diretoria, tipo)
- Paginação de resultados
- Upload de dados via CSV (+5000 escolas)
- API REST


## Rodar o projeto

Instala as dependências na raiz do projeto:
npm install

Cria um arquivo .env com suas configs do postgres:
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=escolas

Depois roda o schema e o seed:
psql -U postgres -d escolas -f db/schema.sql
npm run seed
npm run dev

Pronto, acessa http://localhost:3000

## Endpoints principais

GET /api/escolas - Listar escolas (com paginação)
GET /api/escolas/:id - Buscar escola por ID
POST /api/escolas - Criar nova escola
PUT /api/escolas/:id - Atualizar escola
DELETE /api/escolas/:id - Deletar escola
GET /api/escolas/stats - Estatísticas gerais

## Filtros e Referências

GET /api/referencias/municipios - Listar municípios
GET /api/referencias/diretorias - Listar diretorias
GET /api/referencias/tipos-escola - Listar tipos de escola

*Exemplos de Uso*
Listar escolas com filtros:
GET /api/escolas?page=1&limit=20&municipio_id=5&search=municipal

## Estrutura

app/
├── db/           # conexão e schema
├── src/
│   ├── controllers/
│   └── routes/
└── server.js

## Criar escola:

POST /api/escolas
Content-Type: application/json

{
  "codigo": "12345",
  "nome": "Escola Teste",
  "rede_ensino_id": 1,
  "diretoria_id": 1,
  "municipio_id": 1,
  "distrito_id": 1,
  "tipo_escola_id": 1,
  "situacao_id": 1
}