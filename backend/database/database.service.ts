import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;
  private schema: string | null = null;

  async onModuleInit() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL manquant : configurez la variable d’environnement pour Postgres.');
    }
    const parsed = new URL(connectionString);
    const schema = parsed.searchParams.get('schema');
    if (!schema) {
      throw new Error('DATABASE_URL doit inclure ?schema=<nom> (schéma dédié requis)');
    }
    const safeSchema = schema.replace(/"/g, '""');
    this.schema = schema;
    this.pool = new Pool({
      connectionString,
      ssl: process.env.PGSSL_DISABLE === '1' ? false : { rejectUnauthorized: false }
    });
    this.pool.on('connect', (client) => {
      if (this.schema) {
        client.query(`SET search_path TO "${safeSchema}"`).catch((err) => {
          console.error('Impossible de définir le search_path', err);
        });
      }
    });
    await this.query(`SET search_path TO "${safeSchema}"`);
    await this.verifySchema();
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }
    return this.pool.query<T>(text, params);
  }

  private async verifySchema() {
    const res = await this.query<{ scores: string | null; suggestions: string | null }>(
      `SELECT to_regclass('scores') as scores, to_regclass('suggestions') as suggestions`
    );
    const tables = res.rows[0];
    if (!tables?.scores || !tables?.suggestions) {
      throw new Error('Schéma DB incomplet : exécutez npm run db:push pour créer les tables');
    }
  }
}
