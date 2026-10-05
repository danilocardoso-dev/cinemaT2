# Backend

API REST do CineDev, responsável pelas regras de negócio, autenticação, autorização e persistência dos dados.

## Arquitetura

O backend utiliza a arquitetura modular do NestJS:

```text
Requisição HTTP
      ↓
Controller → DTO e validação → Service → Prisma → PostgreSQL
      ↓                         ↓
   Swagger                 Regras de negócio
```

Cada recurso possui seu próprio módulo, controller, service, DTOs e testes. Os principais módulos são:

- `auth`: login, cadastro público e validação do JWT;
- `usuarios`: gerenciamento de usuários e perfis;
- `filmes`, `salas` e `sessoes`: programação do cinema;
- `lanches`: produtos e estoque da bomboniere;
- `pedidos`, `ingressos` e `itens_pedido_lanche`: fluxo de vendas;
- `prisma`: conexão centralizada com o PostgreSQL.

## Por que essa arquitetura foi escolhida

- **Organização:** cada parte do sistema tem uma responsabilidade clara.
- **Manutenção:** alterações em um recurso ficam concentradas no seu módulo.
- **Validação:** os DTOs rejeitam dados inválidos antes de chegarem às regras de negócio.
- **Segurança:** autenticação e perfis são aplicados globalmente por guards.
- **Persistência:** o Prisma mantém o schema, as migrations e o acesso ao PostgreSQL no mesmo padrão.
- **Apresentação:** o Swagger permite demonstrar e testar cada endpoint sem depender do frontend.

Para um projeto de faculdade, essa separação mostra de forma direta conceitos de API REST, orientação a módulos, autenticação, autorização e banco relacional.

## Autenticação e autorização

O login gera um token JWT. A cada requisição autenticada, o backend consulta o usuário atual no banco e valida:

- se o token é válido;
- se o usuário ainda existe;
- se o usuário está ativo;
- se o perfil atual possui acesso à rota.

Uma requisição sem autenticação recebe `401`. Um usuário autenticado, mas sem o perfil exigido, recebe `403`.

O cadastro público em `POST /auth/register` sempre cria um `CLIENTE`. Somente um `ADMIN` pode cadastrar usuários escolhendo outros perfis em `POST /usuarios`.

## Regras de negócio principais

- e-mail de usuário único e senha armazenada com hash;
- uma sala não pode ter duas sessões no mesmo horário;
- a quantidade de ingressos respeita a capacidade da sala;
- o mesmo assento não pode ser vendido duas vezes na mesma sessão;
- o valor do ingresso é calculado pelo backend;
- meia-entrada custa metade do preço-base da sessão;
- estoque e valores dos lanches são controlados pelo backend;
- pedidos têm totais e quantidades recalculados após cada item;
- registros históricos protegidos não são apagados em cascata indevidamente.

## Banco de dados

O modelo relacional contém:

```text
Filme ──< Sessao >── Sala
              │
              └──< Ingresso >── Pedido >── Usuario
                                   │
                                   └──< ItemPedidoLanche >── Lanche
```

As migrations ficam em `prisma/migrations` e devem ser aplicadas com:

```bash
npx prisma migrate deploy
```

## Configuração

Crie o `.env` a partir de `.env.example`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/cinema2?schema=public"
JWT_SECRET="uma-chave-com-pelo-menos-32-caracteres"
JWT_EXPIRES_IN="1d"
PORT=3000
```

## Comandos

```bash
npm install                 # instala as dependências
npx prisma generate         # gera o Prisma Client
npx prisma migrate deploy   # aplica as migrations
npm run start:dev           # inicia em desenvolvimento
npm run build               # gera a versão compilada
npm run start:prod          # executa a versão compilada
npm test                    # executa os testes unitários
npm run test:e2e            # executa os testes de integração
npm run lint                # verifica o código
```

Com a aplicação iniciada, o Swagger fica disponível em http://localhost:3000/api.

## Decisões e limites

O projeto usa `Float` para valores monetários por simplicidade acadêmica. Em um sistema financeiro real, seria recomendado utilizar um tipo decimal. O CORS também está aberto para facilitar os testes locais; em produção, deveria ser limitado ao endereço oficial do frontend.
