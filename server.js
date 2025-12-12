import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(cors({
  origin: [
    'https://block-idle.onrender.com',
    'https://blockidle-backend.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  credentials: false
}));
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL manquant : configurez la variable d’environnement pour Postgres.');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL_DISABLE === '1' ? false : { rejectUnauthorized: false }
});

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'AlexAgo83';
const GITHUB_REPO = process.env.GITHUB_REPO || 'blockidle';
const ALLOWED_SUGGESTION_CATEGORIES = ['feature', 'bug'];
const ALLOWED_STATUSES = ['open', 'done', 'rejected'];
const API_KEYS = (process.env.API_KEYS || process.env.API_KEY || '')
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);

function sanitizePlayerName(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[^\p{L}\p{N}\-'_.\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 64);
}

function requireApiKey(req, res, next) {
  if (!API_KEYS.length) return res.status(503).json({ error: 'API key not configured' });
  const key = req.header('x-api-key')?.trim();
  if (!key) return res.status(401).json({ error: 'API key required' });
  if (!API_KEYS.includes(key)) return res.status(403).json({ error: 'Invalid API key' });
  return next();
}

const mutateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' }
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' }
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
      created_at TIMESTAMPTZ DEFAULT now(),
      build TEXT
    )
  `);
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS stage INTEGER DEFAULT 1');
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1');
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ DEFAULT now()');
  await pool.query('ALTER TABLE scores ADD COLUMN IF NOT EXISTS build TEXT');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id SERIAL PRIMARY KEY,
      player TEXT NOT NULL,
      category TEXT DEFAULT 'feature',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
  await pool.query('ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'open\'');
  await pool.query('CREATE INDEX IF NOT EXISTS suggestions_created_at_idx ON suggestions (created_at DESC)');
}

const SHOULD_INIT_DB = process.env.SKIP_DB_INIT === '1' ? false : true;
if (SHOULD_INIT_DB) {
  initDb().catch((err) => {
    console.error('Erreur lors de l’init DB', err);
    process.exit(1);
  });
} else {
  console.warn('DB init skipped (SKIP_DB_INIT=1)');
}

app.post('/scores', mutateLimiter, requireApiKey, async (req, res) => {
  const { player, score, stage, level, endedAt, build } = req.body || {};
  const name = sanitizePlayerName(player);
  if (!name) return res.status(400).json({ error: 'player requis' });
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'score numérique requis' });
  }

  const safeStage = Number.isFinite(stage) ? Math.max(1, Math.floor(stage)) : null;
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : null;
  const endedAtIso = (() => {
    const d = endedAt ? new Date(endedAt) : new Date();
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  })();

  try {
    const result = await pool.query(
      `
        INSERT INTO scores (player, score, stage, level, ended_at, build)
        VALUES ($1, $2, COALESCE($3, 1), COALESCE($4, 1), $5, $6)
        ON CONFLICT (player)
        DO UPDATE SET
          score = GREATEST(scores.score, EXCLUDED.score),
          stage = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.stage ELSE scores.stage END,
          level = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.level ELSE scores.level END,
          ended_at = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.ended_at ELSE scores.ended_at END,
          build = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.build ELSE scores.build END
        RETURNING player, score, stage, level, ended_at, created_at, build
      `,
      [name, score, safeStage, safeLevel, endedAtIso, build || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /scores error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/scores', readLimiter, async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  try {
    const result = await pool.query(
      `
        SELECT player, score, stage, level, ended_at, created_at, build
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

app.post('/suggestions', mutateLimiter, requireApiKey, async (req, res) => {
  const { player, message, category } = req.body || {};
  const name = sanitizePlayerName(player);
  if (!name) return res.status(400).json({ error: 'player requis' });
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message requis' });
  }

  const text = message.trim().slice(0, 1000);
  const cat = ALLOWED_SUGGESTION_CATEGORIES.includes((category || '').trim())
    ? category.trim()
    : 'feature';
  const status = 'open';

  try {
    const result = await pool.query(
      `
        INSERT INTO suggestions (player, category, message, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, player, category, message, status, created_at
      `,
      [name, cat, text, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /suggestions error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/suggestions', readLimiter, async (req, res) => {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
  try {
    const result = await pool.query(
      `
        SELECT id, player, category, message, status, created_at
        FROM suggestions
        ORDER BY created_at DESC
        LIMIT $1
      `,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /suggestions error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/suggestions/:id', mutateLimiter, requireApiKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  try {
    const result = await pool.query(
      'DELETE FROM suggestions WHERE id = $1 RETURNING id',
      [id]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ ok: true, id });
  } catch (err) {
    console.error('DELETE /suggestions/:id error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/suggestions/:id/status', mutateLimiter, requireApiKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  const statusRaw = (req.body?.status || '').trim().toLowerCase();
  if (!ALLOWED_STATUSES.includes(statusRaw)) {
    return res.status(400).json({ error: 'statut invalide' });
  }
  try {
    const result = await pool.query(
      `
        UPDATE suggestions
        SET status = $1
        WHERE id = $2
        RETURNING id, player, category, message, status, created_at
      `,
      [statusRaw, id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /suggestions/:id/status error', err);
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

async function fetchGithubCommits(limit = 10) {
  const perPage = Math.max(1, Math.min(100, limit));
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=${perPage}`;
  const headers = {
    'User-Agent': 'blockidle-backend'
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data)
    ? data.map((c) => ({
        hash: c.sha ? c.sha.slice(0, 7) : '',
        message: c.commit?.message?.split('\n')[0] || '',
        date: c.commit?.author?.date?.slice(0, 10) || ''
      }))
    : [];
}

app.get('/commits', async (_req, res) => {
  try {
    const commits = await fetchGithubCommits(10);
    res.json(commits);
  } catch (err) {
    console.error('Erreur GitHub commits', err);
    res.status(500).json({ error: 'Impossible de lire les commits via GitHub' });
  }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Serveur en écoute sur port ${port}`);
  });
}

export { app, pool, requireApiKey };
export default app;
