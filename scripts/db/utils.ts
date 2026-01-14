import { Client, ClientConfig } from 'pg';
import { spawnSync } from 'node:child_process';

export type DbConfig = {
  url: string;
  schema: string;
  ssl: ClientConfig['ssl'];
};

export function loadDbConfig(): DbConfig {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL manquant');
  }
  const parsed = new URL(url);
  const schema = parsed.searchParams.get('schema') || '';
  if (!schema) {
    throw new Error('DATABASE_URL doit inclure ?schema=<nom>');
  }
  const ssl = process.env.PGSSL_DISABLE === '1' ? false : { rejectUnauthorized: false };
  return { url, schema, ssl };
}

export function assertSchemaAllowed(schema: string, force = false) {
  if (schema === 'public' && !force) {
    throw new Error('Refus : schema=public sans SCHEMA_RESET_FORCE=1');
  }
}

export async function withClient<T>(cfg: DbConfig, fn: (client: Client) => Promise<T>) {
  const client = new Client({ connectionString: cfg.url, ssl: cfg.ssl });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

export async function ensureSchema(client: Client, schema: string) {
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema.replace(/"/g, '""')}"`);
}

export async function dropAndRecreateSchema(client: Client, schema: string) {
  const safeName = schema.replace(/"/g, '""');
  await client.query(`DROP SCHEMA IF EXISTS "${safeName}" CASCADE`);
  await client.query(`CREATE SCHEMA "${safeName}"`);
}

export function runPrismaPush() {
  const res = spawnSync('npx', ['prisma', 'db', 'push'], { stdio: 'inherit', env: process.env });
  if (res.status !== 0) {
    throw new Error('prisma db push a échoué');
  }
}

export function runSeed() {
  const res = spawnSync('npx', ['tsx', 'prisma/seed.ts'], { stdio: 'inherit', env: process.env });
  if (res.status !== 0) {
    throw new Error('db:seed a échoué');
  }
}
