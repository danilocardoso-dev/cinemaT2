// Sobe um PostgreSQL de verdade (binários oficiais) sem instalar nada no Windows.
// Os dados ficam na pasta backend/.pgdata. Uso: npm run db:dev
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import EmbeddedPostgres from 'embedded-postgres';

const dir = resolve(process.cwd(), '.pgdata');
const porta = Number(process.env.PGPORT ?? 5432);
const banco = process.env.PGDATABASE ?? 'cinema2';

const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: 'postgres',
  password: 'postgres',
  port: porta,
  persistent: true,
});

const primeiraVez = !existsSync(resolve(dir, 'PG_VERSION'));
if (primeiraVez) await pg.initialise();
await pg.start();

if (primeiraVez) {
  await pg.createDatabase(banco);
}

console.log(`\nPostgreSQL pronto em localhost:${porta} (banco "${banco}").`);
console.log(`DATABASE_URL="postgresql://postgres:postgres@localhost:${porta}/${banco}?schema=public"`);
console.log('Deixe esta janela aberta. Ctrl+C para parar.\n');

const parar = async () => {
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', parar);
process.on('SIGTERM', parar);
