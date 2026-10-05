# CineDev

Sistema web acadêmico para gerenciamento de cinema. O projeto reúne cadastro de filmes, salas, sessões e lanches, além da emissão de ingressos e do registro de pedidos.

O repositório contém as duas aplicações necessárias:

- `backend`: API REST em NestJS, Prisma e PostgreSQL;
- `frontend`: interface em React, TypeScript e Vite.

## Tecnologias

- Node.js 20.19 ou superior
- NestJS 11
- React 18 e TypeScript
- Prisma ORM 7
- PostgreSQL
- JWT para autenticação
- Swagger para documentação e testes da API

## Como iniciar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/danilocardoso-dev/cinemaT2.git
cd cinemaT2
```

### 2. Preparar o PostgreSQL

Crie um banco vazio chamado `cinema2`. Depois, dentro de `backend`, copie `.env.example` para `.env` e ajuste os dados da conexão:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/cinema2?schema=public"
JWT_SECRET="uma-chave-com-pelo-menos-32-caracteres"
JWT_EXPIRES_IN="1d"
PORT=3000
```

O arquivo `.env` contém dados locais e não é enviado ao Git.

### 3. Iniciar o backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

### 4. Criar o primeiro usuário

No Swagger, execute `POST /auth/register`. O cadastro público sempre cria um usuário com perfil `CLIENTE`.

Para transformar o primeiro usuário em administrador, execute no PostgreSQL, substituindo o e-mail:

```sql
UPDATE usuarios
SET cargo = 'ADMIN'
WHERE email = 'seu-email@exemplo.com';
```

Depois, faça login novamente em `POST /auth/login` e use o token retornado no botão **Authorize** do Swagger.

> Se todos os usuários forem apagados durante a apresentação, basta registrar novamente o primeiro usuário e repetir a promoção para `ADMIN`.

### 5. Iniciar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

- Aplicação: http://localhost:8080

Por padrão, o frontend utiliza `http://localhost:3000`. Para alterar esse endereço, copie `frontend/.env.example` para `frontend/.env` e configure `VITE_API_URL`.

## Perfis de acesso

| Perfil | Permissões principais |
| --- | --- |
| `CLIENTE` | Login e consulta dos dados disponíveis |
| `ATENDENTE` | Gerenciamento de sessões, lanches, pedidos e ingressos |
| `ADMIN` | Acesso administrativo completo, incluindo usuários, filmes e salas |

As permissões visuais do frontend melhoram a experiência, mas a validação de segurança é feita pelo backend.

## Roteiro rápido para apresentação

1. Cadastre um usuário pelo Swagger.
2. Promova-o para `ADMIN` no banco e faça login.
3. Teste uma rota protegida sem token e confirme o retorno `401`.
4. Informe o token no **Authorize** e repita a chamada.
5. Mostre que um perfil sem permissão recebe `403`.
6. Entre no frontend com o mesmo usuário.
7. Cadastre um filme, sala, sessão ou lanche.
8. Consulte a tabela correspondente no PostgreSQL para mostrar o dado persistido.

## Validação do projeto

No backend:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

No frontend:

```bash
npm run lint
npm run build
```

Detalhes técnicos estão em [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).
