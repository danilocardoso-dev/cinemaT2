# Frontend

Interface web do CineDev. Permite realizar login e gerenciar filmes, salas, sessões, lanches e vendas de acordo com o perfil do usuário.

## Arquitetura

O frontend é uma SPA desenvolvida com React e TypeScript:

```text
Página → Componente/Formulário → Serviço Axios → API NestJS
  ↑              ↓                    ↓
Rotas       Validação local       Token JWT
```

As responsabilidades estão divididas em:

- `src/pages`: páginas acessadas pelas rotas;
- `src/components`: formulários, listas, navegação e componentes reutilizáveis;
- `src/services/api.ts`: comunicação centralizada com o backend;
- `src/auth`: sessão do usuário e estado de autenticação;
- `src/schemas`: validações dos formulários;
- `src/types`: contratos TypeScript usados pela interface.

## Por que essa arquitetura foi escolhida

- **React:** facilita a construção de telas por componentes reutilizáveis.
- **TypeScript:** reduz erros ao validar os formatos enviados e recebidos da API.
- **Vite:** inicia e compila o projeto rapidamente.
- **React Router:** separa login, início e páginas de gerenciamento.
- **Context API:** mantém a autenticação disponível em toda a aplicação sem adicionar complexidade desnecessária.
- **Axios:** centraliza a URL da API, o envio do JWT e o tratamento de respostas `401`.
- **Bootstrap:** fornece uma interface responsiva com pouco código CSS.

Essa combinação é adequada ao projeto acadêmico porque mantém a interface simples, organizada e fácil de demonstrar.

## Autenticação

Após o login, o frontend armazena o token JWT localmente e o envia no cabeçalho:

```text
Authorization: Bearer <token>
```

O perfil retornado pelo backend controla quais ações aparecem na interface. Essa regra visual não substitui a segurança: o backend continua validando todas as permissões.

Se o token expirar ou for recusado, a sessão local é limpa e o usuário volta para a tela de login.

## Fluxo de dados

1. O usuário preenche um formulário.
2. O frontend valida os campos.
3. O serviço envia a requisição para a API.
4. O backend aplica autenticação, regras de negócio e persistência.
5. A resposta atualiza a lista exibida na tela.

No fluxo de venda, o frontend cria o pedido e depois envia os ingressos e lanches selecionados. Preços, totais e estoque são calculados pelo backend para evitar alterações indevidas pelo navegador.

## Configuração

O endereço padrão da API é `http://localhost:3000`. Para alterá-lo, copie `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Comandos

```bash
npm install       # instala as dependências
npm run dev       # inicia em desenvolvimento
npm run build     # gera a versão de produção
npm run preview   # visualiza a versão compilada
npm run lint      # verifica o código
```

Em desenvolvimento, a aplicação fica disponível em http://localhost:8080.

## Páginas principais

- `/login`: autenticação;
- `/`: página inicial;
- `/filmes`: cadastro e consulta de filmes;
- `/salas`: cadastro e consulta de salas;
- `/sessoes`: programação e venda de ingressos;
- `/lanches`: gerenciamento da bomboniere.

O backend deve estar em execução para que login, consultas e cadastros funcionem.
