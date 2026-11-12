# CineDev Mobile

Versão em app (React Native + Expo) do painel web do CineDev. Usa a mesma API NestJS do `backend`.

## O que o app faz

| Tela | Quem acessa |
| --- | --- |
| Login e cadastro (cadastro cria usuário `CLIENTE`) | todos |
| Início, Filmes, Sessões, Lanches, Salas (consulta) | todos os perfis |
| Cadastrar/editar/excluir **filmes e salas** | `ADMIN` |
| Cadastrar/editar/excluir **sessões e lanches** | `ADMIN`, `ATENDENTE` |
| Vender ingressos e lanches (novo pedido) | `ADMIN`, `ATENDENTE` |
| Perfil (dados de `/auth/me`) e sair | todos |

As permissões seguem o painel web; a validação de segurança continua sendo feita pela API.

## Como rodar

1. Suba o backend (veja o README da raiz): `npm run db:dev` (PostgreSQL), `npx prisma migrate deploy` e `npm run start:dev` em `backend`. Para ter usuários de teste: `npm run db:seed-dev`.
2. Neste diretório:

```bash
npm install
npx expo start
```

3. Abra com `w` (navegador), `a` (emulador Android) ou escaneie o QR Code no Expo Go.

### Endereço da API

O app descobre sozinho o IP do computador (o mesmo que serve o app via Expo) e usa a porta 3000;
no navegador usa `http://localhost:3000`. O celular e o computador precisam estar na mesma rede.
Para forçar outro endereço, crie `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

## Estrutura

```
src/
├── auth/          AuthContext.tsx (login, cadastro, sessão salva no AsyncStorage)
├── services/      api.ts (axios + endpoints), storage.ts (token)
├── navigation/    AppRoutes.tsx (login | abas + telas de formulário), types.ts (rotas tipadas)
├── screens/       Login, Register, Home, Filmes, Salas, Sessoes, Lanches, Pedido, Perfil
├── components/    ui.tsx (campos, botões, listas)
├── schemas/       validation.ts (zod, mesmas regras do painel)
└── styles/        theme.ts
```

## Observações

- Data/hora da sessão é digitada como `AAAA-MM-DD HH:mm` (horário local).
- Um pedido é criado em etapas (pedido, ingressos, itens de lanche) e desfeito se alguma falhar, como no painel web.

## TypeScript

O app é escrito em TypeScript (modo `strict`). Para checar os tipos: `npx tsc --noEmit`. Os tipos da API ficam em `src/types` e as rotas tipadas em `src/navigation/types.ts`.
