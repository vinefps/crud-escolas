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
- **API Backend:** https://crud-escolas-production.up.railway.app (substitua pela URL real do seu Railway)

## 🖥️ Como Executar Localmente

### Pré-requisitos
- Node.js 16+
- PostgreSQL

### Backend

1. Clone o repositório e entre na pasta do backend
```bash
git clone https://github.com/vinefps/crud-escolas.git
cd crud-escolas/api
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo .env na raiz da pasta api
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=escolas
DB_PASSWORD=sua_senha
DB_PORT=5432
NODE_ENV=development
JWT_SECRET=seu_segredo_aqui
FRONTEND_URL=http://localhost:5173
```

4. Crie o banco de dados e execute o schema para criar as tabelas
```bash
psql -U postgres -c "CREATE DATABASE escolas;"
psql -U postgres -d escolas -f src/db/schema.sql
```

5. Execute o servidor backend
```bash
npm run dev
```
O servidor estará rodando em http://localhost:5000

### Frontend

1. Abra um novo terminal e entre na pasta web
```bash
cd crud-escolas/web
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo .env na raiz da pasta web
```env
VITE_API_URL=http://localhost:5000/api
```

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```
A aplicação estará rodando em http://localhost:5173

## 👤 Usuário de Teste

```
Email: admin@escola.com
Senha: admin123
```

## 📊 Fonte dos Dados

[CSV - Instalações Físicas por Unidade Escolar - Município de São Paulo](https://dados.educacao.sp.gov.br/dataset/instala%C3%A7%C3%B5es-f%C3%ADsicas-por-unidade-escolar)

## 📝 Sobre

Projeto desenvolvido como teste prático para vaga de Desenvolvedor Fullstack.
