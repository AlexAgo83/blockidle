import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.SKIP_DB_INIT = '1';
process.env.API_KEYS = 'testkey';

const { default: app, pool } = await import('./server.js');

// Mock DB queries to avoid hitting a real database during tests
const scoresStore = [];
pool.query = async (text, params = []) => {
  if (typeof text !== 'string') return { rows: [], rowCount: 0 };
  if (text.includes('INSERT INTO scores')) {
    const [player, score, stage, level, ended_at, build] = params;
    const safeBuild = build || 'Old';
    const existingIdx = scoresStore.findIndex(
      (row) => row.player === player && row.build === safeBuild
    );
    if (existingIdx >= 0) {
      const current = scoresStore[existingIdx];
      if (score > current.score) {
        scoresStore[existingIdx] = {
          ...current,
          score,
          stage,
          level,
          ended_at,
          created_at: current.created_at,
          build: safeBuild
        };
      }
      return { rows: [scoresStore[existingIdx]], rowCount: 1 };
    }
    const row = {
      player,
      score,
      stage,
      level,
      ended_at,
      created_at: new Date().toISOString(),
      build: safeBuild
    };
    scoresStore.push(row);
    return { rows: [row], rowCount: 1 };
  }
  if (text.includes('SELECT player, score')) {
    const limit = Number(params[0]) || 10;
    const sorted = [...scoresStore].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const da = Date.parse(a.ended_at || a.created_at || 0) || 0;
      const db = Date.parse(b.ended_at || b.created_at || 0) || 0;
      return da - db;
    });
    return { rows: sorted.slice(0, limit), rowCount: Math.min(sorted.length, limit) };
  }
  if (text.includes('INSERT INTO suggestions')) {
    return {
      rows: [{
        id: 1,
        player: params[0],
        category: params[1],
        message: params[2],
        created_at: new Date().toISOString()
      }],
      rowCount: 1
    };
  }
  if (text.startsWith('DELETE FROM suggestions')) {
    return { rowCount: 1, rows: [{ id: params[0] }] };
  }
  // other queries
  return { rows: [], rowCount: 0 };
};

test.beforeEach(() => {
  scoresStore.length = 0;
});

const api = request(app);

test('POST /scores requires API key', async () => {
  const res = await api.post('/scores').send({ player: 'A', score: 1, stage: 1, level: 1 });
  assert.equal(res.status, 401);
  assert.equal(res.body?.error, 'API key required');
});

test('POST /scores rejects invalid API key', async () => {
  const res = await api
    .post('/scores')
    .set('X-API-Key', 'wrong')
    .send({ player: 'A', score: 1, stage: 1, level: 1 });
  assert.equal(res.status, 403);
});

test('POST /scores succeeds with valid API key', async () => {
  const res = await api
    .post('/scores')
    .set('X-API-Key', 'testkey')
    .send({ player: 'A', score: 1, stage: 1, level: 1 });
  assert.equal(res.status, 200);
  assert.equal(res.body.player, 'A');
  assert.equal(res.body.score, 1);
});

test('POST /scores sanitizes player name', async () => {
  const res = await api
    .post('/scores')
    .set('X-API-Key', 'testkey')
    .send({ player: '  $$A   B!!', score: 5, stage: 1, level: 1 });
  assert.equal(res.status, 200);
  assert.equal(res.body.player, 'A B');
});

test('POST /scores rejects empty after sanitize', async () => {
  const res = await api
    .post('/scores')
    .set('X-API-Key', 'testkey')
    .send({ player: '!!!!', score: 1, stage: 1, level: 1 });
  assert.equal(res.status, 400);
});

test('POST /scores keeps per-build entries and ignores lower scores on same build', async () => {
  const player = 'Tester';
  // First build A score 10
  await api.post('/scores').set('X-API-Key', 'testkey').send({
    player,
    score: 10,
    stage: 2,
    level: 3,
    build: 'A'
  });
  // Lower score on same build should not replace
  await api.post('/scores').set('X-API-Key', 'testkey').send({
    player,
    score: 5,
    stage: 5,
    level: 5,
    build: 'A'
  });
  // Different build with lower score should be stored separately
  await api.post('/scores').set('X-API-Key', 'testkey').send({
    player,
    score: 7,
    stage: 1,
    level: 1,
    build: 'B'
  });
  const res = await api.get('/scores?limit=10');
  assert.equal(res.status, 200);
  // Expect two entries: A:10 and B:7
  const builds = res.body.map((r) => `${r.build}:${r.score}`).sort();
  assert.deepEqual(builds, ['A:10', 'B:7']);
});

test('POST /suggestions succeeds with valid API key', async () => {
  const res = await api
    .post('/suggestions')
    .set('X-API-Key', 'testkey')
    .send({ player: 'A', message: 'hi', category: 'feature' });
  assert.equal(res.status, 200);
  assert.equal(res.body.player, 'A');
  assert.equal(res.body.message, 'hi');
});
