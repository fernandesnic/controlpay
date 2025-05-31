# ControlPay - Sistema de Gestão Financeira

O ControlPay é um sistema completo de gestão financeira pessoal que permite controlar receitas, despesas e acompanhar sua saúde financeira através de gráficos e relatórios detalhados.

## 🚀 Funcionalidades

- ✅ Cadastro de receitas e despesas
- ✅ Categorização de transações
- ✅ Controle de despesas fixas e variáveis
- ✅ Sistema de parcelamento
- ✅ Dashboard com visão geral
- ✅ Gráficos de análise financeira
- ✅ API RESTful com validações
- ✅ Interface moderna e responsiva

## 🛠️ Tecnologias Utilizadas

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- React Context
- Chart.js

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- REST API

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

### Variáveis de Ambiente

O projeto utiliza arquivos `.env` para configuração. Existem arquivos `.env.example` em ambos os diretórios (frontend e backend) que servem como template.

#### Backend (controlpay-api/.env)

```env
# Configurações do Servidor
PORT=3333                  # Porta onde a API irá rodar
NODE_ENV=development      # Ambiente (development, production, test)

# Configurações do Banco de Dados
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/controlpay?schema=public"

# Configurações de Segurança
JWT_SECRET=sua_chave_jwt_secreta_aqui    # Chave para geração de tokens JWT
CORS_ORIGIN=http://localhost:3000         # URL do frontend para CORS

# Configurações de Rate Limiting (opcional)
RATE_LIMIT_WINDOW=15                      # Janela de tempo em minutos
RATE_LIMIT_MAX_REQUESTS=100               # Número máximo de requisições na janela
```

#### Frontend (controlpay/.env)

```env
# Ambiente
NODE_ENV=development                      # Ambiente (development, production)

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000    # URL base do frontend
NEXT_PUBLIC_API_URL=http://localhost:3333     # URL da API

# Configurações de autenticação
NEXTAUTH_SECRET=sua_chave_secreta_aqui    # Chave para sessões NextAuth
NEXTAUTH_URL=http://localhost:3000         # URL base para autenticação

# Outras configurações
SKIP_ENV_VALIDATION=false                  # Desativa validação de env em desenvolvimento
```

Para configurar as variáveis de ambiente:

1. Copie o arquivo `.env.example` para `.env` em cada diretório
2. Substitua os valores de exemplo pelos valores reais do seu ambiente
3. Nunca compartilhe ou comite seus arquivos `.env` com valores reais

### Configurando o Backend

1. Entre na pasta da API:

```bash
cd controlpay-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
# Crie um arquivo .env com o seguinte conteúdo:
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/controlpay?schema=public"
PORT=3333
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco com dados de exemplo:

```bash
npm run seed
```

6. Inicie o servidor:

```bash
npm run dev
```

### Configurando o Frontend

1. Entre na pasta do frontend:

```bash
cd controlpay
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🌐 Endpoints da API

### Transações

- `GET /api/transactions` - Lista todas as transações
- `GET /api/transactions/:id` - Busca uma transação específica
- `POST /api/transactions` - Cria uma nova transação
- `PUT /api/transactions/:id` - Atualiza uma transação
- `DELETE /api/transactions/:id` - Remove uma transação

## 💡 Estrutura do Projeto

```
controlpay/
  ├── src/
  │   ├── components/     # Componentes React
  │   ├── contexts/       # Contextos da aplicação
  │   ├── lib/           # Configurações e utilitários
  │   └── app/           # Páginas da aplicação
  └── public/            # Arquivos estáticos

controlpay-api/
  ├── src/
  │   ├── controllers/   # Controladores da API
  │   ├── routes/        # Rotas da API
  │   └── lib/          # Utilitários e configurações
  └── prisma/           # Schema e migrações do banco
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Nicolas Fernandes - Desenvolvimento inicial

## 🙏 Agradecimentos

- Agradeço a todos que contribuíram direta ou indiretamente para o desenvolvimento deste projeto.

# ControlPay

# ControlPay
