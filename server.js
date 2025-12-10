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
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

initDb().catch((err) => {
  console.error('Erreur lors de l’init DB', err);
  process.exit(1);
});

app.post('/scores', async (req, res) => {
  const { player, score } = req.body || {};
  if (!player || typeof player !== 'string' || !player.trim()) {
    return res.status(400).json({ error: 'player requis' });
  }
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'score numérique requis' });
  }

  const name = player.trim().slice(0, 64);
  try {
    const result = await pool.query(
      `
        INSERT INTO scores (player, score)
        VALUES ($1, $2)
        ON CONFLICT (player)
        DO UPDATE SET score = GREATEST(scores.score, EXCLUDED.score)
        RETURNING player, score, created_at
      `,
      [name, score]
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
        SELECT player, score, created_at
        FROM scores
        ORDER BY score DESC, created_at ASC
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
app.get(['/', '/:path(*)'], (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en écoute sur port ${port}`);
});
