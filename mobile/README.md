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

1. Suba o backend (veja o README da raiz): MySQL do XAMPP ligado e `npm run start:dev` em `backend`.
2. Neste diretório:

```bash
npm install
npx expo start
```

3. Abra com `w` (navegador), `a` (emulador Android) ou escaneie o QR Code no Expo Go.

### Endereço da API

Por padrão: `http://localhost:3000` (web/iOS) e `http://10.0.2.2:3000` (emulador Android).
Em celular físico, crie `mobile/.env` com o IP do computador na mesma rede:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

## Estrutura

```
src/
├── auth/          AuthContext (login, cadastro, sessão salva no AsyncStorage)
├── services/      api.js (axios + endpoints), storage.js (token)
├── navigation/    AppRoutes.js (login | abas + telas de formulário)
├── screens/       Login, Register, Home, Filmes, Salas, Sessoes, Lanches, Pedido, Perfil
├── components/    ui.js (campos, botões, listas)
├── schemas/       validation.js (zod, mesmas regras do painel)
└── styles/        theme.js
```

## Observações

- Data/hora da sessão é digitada como `AAAA-MM-DD HH:mm` (horário local).
- Um pedido é criado em etapas (pedido, ingressos, itens de lanche) e desfeito se alguma falhar, como no painel web.
