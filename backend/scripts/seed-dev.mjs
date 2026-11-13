// Cria usuários e dados de exemplo (filmes, salas, sessões e lanches) para desenvolvimento.
// Precisa da API e do banco no ar. Pode ser rodado várias vezes: não duplica o que já existe.
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

// 1) Usuários (o cadastro público sempre cria CLIENTE; o cargo é ajustado direto no banco)
const usuarios = [
  { nome: 'Admin Teste', email: 'admin@cinema.com', cargo: 'ADMIN' },
  { nome: 'Gerente Cinema', email: 'gerente@cinema.com', cargo: 'ADMIN' },
  { nome: 'Atendente Teste', email: 'atendente@cinema.com', cargo: 'ATENDENTE' },
  { nome: 'Carla Atendente', email: 'carla@cinema.com', cargo: 'ATENDENTE' },
  { nome: 'Bruno Atendente', email: 'bruno@cinema.com', cargo: 'ATENDENTE' },
  { nome: 'Cliente Teste', email: 'cliente@cinema.com', cargo: 'CLIENTE' },
  { nome: 'Ana Souza', email: 'ana@cinema.com', cargo: 'CLIENTE' },
  { nome: 'Pedro Lima', email: 'pedro@cinema.com', cargo: 'CLIENTE' },
  { nome: 'Julia Costa', email: 'julia@cinema.com', cargo: 'CLIENTE' },
  { nome: 'Rafael Alves', email: 'rafael@cinema.com', cargo: 'CLIENTE' },
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

const login = await req('POST', '/auth/login', { email: 'admin@cinema.com', senha: SENHA });
const token = login.dados.access_token;
if (!token) throw new Error('Login do admin falhou: ' + JSON.stringify(login.dados));

const criados = { filmes: 0, salas: 0, sessoes: 0, lanches: 0 };

// 2) Filmes (pula os que já existem pelo título)
const catalogo = [
  { titulo: 'Duna: Parte Três', sinopse: 'A saga continua no deserto de Arrakis.', classificacao: '14', duracao: 150, genero: 'Ficção Científica' },
  { titulo: 'Toy Story 5', sinopse: 'Os brinquedos voltam para uma nova aventura.', classificacao: 'Livre', duracao: 100, genero: 'Animação' },
  { titulo: 'Missão Impossível: Ajuste de Contas', sinopse: 'Ethan Hunt enfrenta sua missão mais perigosa.', classificacao: '14', duracao: 160, genero: 'Ação' },
  { titulo: 'Operação Natal', sinopse: 'Uma família tenta salvar o Natal em plena nevasca.', classificacao: 'Livre', duracao: 95, genero: 'Comédia' },
  { titulo: 'O Último Sussurro', sinopse: 'Uma casa antiga guarda um segredo que ninguém deveria ouvir.', classificacao: '16', duracao: 110, genero: 'Terror' },
  { titulo: 'Entre Duas Estações', sinopse: 'Dois desconhecidos se encontram em uma viagem de trem.', classificacao: '12', duracao: 120, genero: 'Romance' },
  { titulo: 'A Ilha Perdida', sinopse: 'Um grupo de amigos descobre um mapa e parte em uma aventura.', classificacao: '10', duracao: 105, genero: 'Aventura' },
  { titulo: 'Cartas ao Vento', sinopse: 'A história de uma família ao longo de três gerações.', classificacao: '12', duracao: 135, genero: 'Drama' },
];
const filmesExistentes = (await req('GET', '/filmes', null, token)).dados;
const filmes = [...filmesExistentes];
for (const f of catalogo) {
  if (filmes.some((x) => x.titulo === f.titulo)) continue;
  const r = await req('POST', '/filmes', { ...f, datasExibicao: '01/12/2026 a 31/01/2027' }, token);
  if (r.ok) { filmes.push(r.dados); criados.filmes += 1; } else console.log('Filme não criado:', f.titulo, r.dados.message);
}

// 3) Salas (números 1 a 4)
const salas = [...(await req('GET', '/salas', null, token)).dados];
for (const [numero, capacidade] of [[1, 120], [2, 80], [3, 60], [4, 150]]) {
  if (salas.some((s) => s.numero === numero)) continue;
  const r = await req('POST', '/salas', { numero, capacidade }, token);
  if (r.ok) { salas.push(r.dados); criados.salas += 1; } else console.log('Sala não criada:', numero, r.dados.message);
}

// 4) Sessões: próximos 7 dias, 3 horários por dia, filmes alternando entre as salas
const sessoesExistentes = (await req('GET', '/sessoes', null, token)).dados;
const jaTem = (salaId, iso) => sessoesExistentes.some((s) => s.salaId === salaId && new Date(s.dataHora).getTime() === new Date(iso).getTime());
let i = 0;
for (let dia = 1; dia <= 7; dia += 1) {
  for (const hora of [14, 17, 20]) {
    const data = new Date();
    data.setDate(data.getDate() + dia);
    data.setHours(hora, 0, 0, 0);
    const sala = salas[i % salas.length];
    const filme = filmes[i % filmes.length];
    i += 1;
    const iso = data.toISOString();
    if (jaTem(sala.id, iso)) continue;
    const r = await req('POST', '/sessoes', { filmeId: filme.id, salaId: sala.id, dataHora: iso }, token);
    if (r.ok) criados.sessoes += 1; else console.log('Sessão não criada:', r.dados.message);
  }
}

// 5) Lanches (pula os que já existem pelo nome)
const bomboniere = [
  { nome: 'Pipoca grande', descricao: 'Pipoca salgada 500g', valorUnitario: 18.5, qtUnidade: 50 },
  { nome: 'Pipoca média', descricao: 'Pipoca salgada 300g', valorUnitario: 14, qtUnidade: 50 },
  { nome: 'Refrigerante 500ml', descricao: 'Refrigerante gelado', valorUnitario: 9, qtUnidade: 80 },
  { nome: 'Combo casal', descricao: 'Pipoca grande e 2 refrigerantes', valorUnitario: 38, qtUnidade: 30 },
  { nome: 'Chocolate', descricao: 'Barra de chocolate ao leite', valorUnitario: 7.5, qtUnidade: 40 },
  { nome: 'Água mineral', descricao: 'Água mineral sem gás 500ml', valorUnitario: 5, qtUnidade: 60 },
];
const lanchesExistentes = (await req('GET', '/lanches', null, token)).dados;
for (const l of bomboniere) {
  if (lanchesExistentes.some((x) => x.nome === l.nome)) continue;
  const r = await req('POST', '/lanches', l, token);
  if (r.ok) criados.lanches += 1; else console.log('Lanche não criado:', l.nome, r.dados.message);
}

console.log('Criados agora:', criados);
console.log('\nUsuários (senha 123456 para todos):');
for (const u of usuarios) console.log(`  ${u.cargo.padEnd(9)} ${u.email}`);
