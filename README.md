# ControlPay - Sistema de Controle Financeiro

O ControlPay é um sistema de controle financeiro que permite gerenciar receitas e despesas, com suporte a transações fixas, variáveis e parceladas.

## Tecnologias Utilizadas

### Backend

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL

### Frontend

- Next.js
- TypeScript
- TailwindCSS
- Axios

## Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/ControlPay.git
cd ControlPay
```

2. Instale as dependências do backend:

```bash
cd controlpay-api
npm install
```

3. Configure o banco de dados:

- Crie um arquivo `.env` na pasta `controlpay-api` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/controlpay"
PORT=3333
```

- Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

4. Instale as dependências do frontend:

```bash
cd ../controlpay
npm install
```

5. Configure o frontend:

- Crie um arquivo `.env` na pasta `controlpay` com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Executando o Projeto

1. Inicie o backend:

```bash
cd controlpay-api
npm run dev
```

2. Em outro terminal, inicie o frontend:

```bash
cd controlpay
npm run dev
```

3. Acesse o sistema em `http://localhost:3000`

## Funcionalidades

- Cadastro de transações (receitas e despesas)
- Suporte a transações fixas, variáveis e parceladas
- Categorização de transações
- Visualização por tipo de transação
- Interface responsiva e moderna

## Estrutura do Projeto

### Backend (controlpay-api)

- `src/`
  - `controllers/` - Controladores da aplicação
  - `routes/` - Rotas da API
  - `lib/` - Configurações e utilitários
  - `prisma/` - Schema e migrações do banco de dados

### Frontend (controlpay)

- `src/`
  - `app/` - Páginas e layouts
  - `components/` - Componentes reutilizáveis
  - `contexts/` - Contextos da aplicação
  - `lib/` - Utilitários e configurações
  - `styles/` - Estilos globais

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
