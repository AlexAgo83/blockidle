import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL manquant : configurez la variable d’environnement pour Postgres.');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL_DISABLE === '1' ? false : { rejectUnauthorized: false }
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      player TEXT NOT NULL UNIQUE,
      score INTEGER NOT NULL,
      stage INTEGER DEFAULT 1,
      level INTEGER DEFAULT 1,
      ended_at TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS stage INTEGER DEFAULT 1');
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1');
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ DEFAULT now()');
}

initDb().catch((err) => {
  console.error('Erreur lors de l’init DB', err);
  process.exit(1);
});

app.post('/scores', async (req, res) => {
  const { player, score, stage, level, endedAt } = req.body || {};
  if (!player || typeof player !== 'string' || !player.trim()) {
    return res.status(400).json({ error: 'player requis' });
  }
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'score numérique requis' });
  }

  const name = player.trim().slice(0, 64);
  const safeStage = Number.isFinite(stage) ? Math.max(1, Math.floor(stage)) : null;
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : null;
  const endedAtIso = (() => {
    const d = endedAt ? new Date(endedAt) : new Date();
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  })();

  try {
    const result = await pool.query(
      `
        INSERT INTO scores (player, score, stage, level, ended_at)
        VALUES ($1, $2, COALESCE($3, 1), COALESCE($4, 1), $5)
        ON CONFLICT (player)
        DO UPDATE SET
          score = GREATEST(scores.score, EXCLUDED.score),
          stage = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.stage ELSE scores.stage END,
          level = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.level ELSE scores.level END,
          ended_at = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.ended_at ELSE scores.ended_at END
        RETURNING player, score, stage, level, ended_at, created_at
      `,
      [name, score, safeStage, safeLevel, endedAtIso]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /scores error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/scores', async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  try {
    const result = await pool.query(
      `
        SELECT player, score, stage, level, ended_at, created_at
        FROM scores
        ORDER BY score DESC, ended_at ASC
        LIMIT $1
      `,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /scores error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB KO' });
  }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en écoute sur port ${port}`);
});
