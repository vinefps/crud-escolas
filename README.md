# 🏫 CRUD - Infraestrutura Escolar no Município de São Paulo

Aplicação fullstack com upload de CSV e CRUD de dados escolares, usando React e Node.js com PostgreSQL.

## 📋 Descrição

Sistema para gerenciamento de infraestrutura das escolas do município de São Paulo, permitindo importação em massa via CSV e operações CRUD completas sobre os dados importados.

## 🚀 Tecnologias

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT (autenticação)

**Frontend:**
- React
- Tailwind CSS
- Axios

**Deploy:**
- Frontend: Vercel
- Backend: Railway
- Banco: Railway (PostgreSQL)

## 🎯 Funcionalidades

- ✅ Upload e importação de arquivo CSV
- ✅ CRUD completo de escolas
- ✅ Busca por nome ou código
- ✅ Paginação de resultados
- ✅ Autenticação com login/senha
- ✅ Deletar todos os dados (admin)

## 🔗 Links

- **Aplicação Online:** https://crud-escolas.vercel.app/
- **API Backend:** https://seu-backend.railway.app

## 🖥️ Como Executar Localmente

### Pré-requisitos
- Node.js 16+
- PostgreSQL

### Backend

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/crud-escolas.git
cd crud-escolas/api

2. Instale as dependências
npm install

3. Configure o .env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=escolas
DB_PASSWORD=sua_senha
DB_PORT=5432
NODE_ENV=development
JWT_SECRET=seu_segredo_aqui
FRONTEND_URL=http://localhost:5173

4. Executa o schema para criar a estrutura do BD.
cd crud-escolas/api
psql -U postgres -d escolas -f src/db/schema.sql

5. Execute o servidor
cd crud-escolas/api
npm run dev 

Frontend

1. Entre na pasta web
cd ../web

2. Instale as dependências
npm install 

3. Configure o .env
OBS: O BACKEND está configurado para rodar na porta 5000
VITE_API_URL=http://localhost:5000/api

4. Execute o servidor de desenvolvimento
cd crud-escolas/web
npm run dev

👤 Usuário de Teste
Email: admin@escola.com
Senha: admin123

📊 Fonte dos Dados
CSV - https://dados.educacao.sp.gov.br/dataset/instala%C3%A7%C3%B5es-f%C3%ADsicas-por-unidade-escolar

## 📝 Projeto

Desenvolvido como teste prático para vaga de Desenvolvedor Fullstack.