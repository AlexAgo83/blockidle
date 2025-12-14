import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;

  async onModuleInit() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('DATABASE_URL manquant : configurez la variable d’environnement pour Postgres.');
    }
    this.pool = new Pool({
      connectionString,
      ssl: process.env.PGSSL_DISABLE === '1' ? false : { rejectUnauthorized: false }
    });
    await this.initSchema();
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

  private async initSchema() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        player TEXT NOT NULL,
        score INTEGER NOT NULL,
        stage INTEGER DEFAULT 1,
        level INTEGER DEFAULT 1,
        ended_at TIMESTAMPTZ DEFAULT now(),
        created_at TIMESTAMPTZ DEFAULT now(),
        submitted_at TIMESTAMPTZ DEFAULT now(),
        build TEXT,
        powers JSONB,
        talents JSONB,
        fusions JSONB
      )
    `);
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS stage INTEGER DEFAULT 1');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ DEFAULT now()');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now()');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS build TEXT');
    await this.query('ALTER TABLE scores DROP CONSTRAINT IF EXISTS scores_player_key');
    await this.query('ALTER TABLE scores ALTER COLUMN build SET DEFAULT \'Old\'');
    await this.query('UPDATE scores SET build = COALESCE(build, \'Old\') WHERE build IS NULL');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS powers JSONB');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS talents JSONB');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS fusions JSONB');
    await this.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS pilot TEXT');
    await this.query('CREATE UNIQUE INDEX IF NOT EXISTS scores_player_build_idx ON scores (player, build)');

    await this.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        player TEXT NOT NULL,
        category TEXT DEFAULT 'feature',
        message TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    await this.query('ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'open\'');
    await this.query('CREATE INDEX IF NOT EXISTS suggestions_created_at_idx ON suggestions (created_at DESC)');
  }
}
