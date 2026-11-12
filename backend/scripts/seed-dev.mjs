// Cria usuários e dados de exemplo para desenvolvimento (API e banco precisam estar no ar).
// Uso: npm run db:seed-dev
import 'dotenv/config';
import pg from 'pg';

const API = process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const SENHA = '123456';

const req = async (metodo, caminho, corpo, token) => {
  const res = await fetch(API + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const dados = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, dados };
};

// 1) usuários (o cadastro público sempre cria CLIENTE; o cargo é ajustado direto no banco)
const usuarios = [
  { nome: 'Admin Teste', email: 'admin@cinema.com', cargo: 'ADMIN' },
  { nome: 'Atendente Teste', email: 'atendente@cinema.com', cargo: 'ATENDENTE' },
  { nome: 'Cliente Teste', email: 'cliente@cinema.com', cargo: 'CLIENTE' },
];
for (const u of usuarios) {
  await req('POST', '/auth/register', { nome: u.nome, email: u.email, senha: SENHA });
}
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
for (const u of usuarios) {
  await db.query('UPDATE usuarios SET cargo = $1::"CargoUsuario" WHERE email = $2', [u.cargo, u.email]);
}
await db.end();

// 2) dados de exemplo (só se o banco estiver vazio)
const login = await req('POST', '/auth/login', { email: 'admin@cinema.com', senha: SENHA });
const token = login.dados.access_token;
if (!token) throw new Error('Login do admin falhou: ' + JSON.stringify(login.dados));

const filmes = (await req('GET', '/filmes', null, token)).dados;
if (filmes.length === 0) {
  const f1 = (await req('POST', '/filmes', { titulo: 'Duna: Parte Três', sinopse: 'A saga continua no deserto de Arrakis.', classificacao: '14', duracao: 150, genero: 'Ficção Científica', datasExibicao: '01/12/2026 a 31/12/2026' }, token)).dados;
  await req('POST', '/filmes', { titulo: 'Toy Story 5', sinopse: 'Os brinquedos voltam para uma nova aventura.', classificacao: 'Livre', duracao: 100, genero: 'Animação', datasExibicao: '01/12/2026 a 31/12/2026' }, token);
  const s1 = (await req('POST', '/salas', { numero: 1, capacidade: 120 }, token)).dados;
  await req('POST', '/salas', { numero: 2, capacidade: 80 }, token);
  await req('POST', '/sessoes', { filmeId: f1.id, salaId: s1.id, dataHora: '2026-12-20T22:30:00.000Z' }, token);
  await req('POST', '/lanches', { nome: 'Pipoca grande', descricao: 'Pipoca salgada 500g', valorUnitario: 18.5, qtUnidade: 50 }, token);
  await req('POST', '/lanches', { nome: 'Refrigerante 500ml', descricao: 'Refrigerante gelado', valorUnitario: 9, qtUnidade: 80 }, token);
  console.log('Dados de exemplo criados.');
} else {
  console.log('Banco já tem dados; exemplos não recriados.');
}

console.log('Usuários (senha 123456): admin@cinema.com, atendente@cinema.com, cliente@cinema.com');
