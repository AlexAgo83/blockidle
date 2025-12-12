import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.SKIP_DB_INIT = '1';
process.env.API_KEYS = 'testkey';

const { default: app, pool } = await import('./server.js');

// Mock DB queries to avoid hitting a real database during tests
pool.query = async (text, params = []) => {
  if (typeof text !== 'string') return { rows: [], rowCount: 0 };
  if (text.includes('INSERT INTO scores')) {
    return {
      rows: [{
        player: params[0],
        score: params[1],
        stage: params[2],
        level: params[3],
        ended_at: params[4],
        created_at: new Date().toISOString(),
        build: params[5]
      }],
      rowCount: 1
    };
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
  // GET queries
  return { rows: [], rowCount: 0 };
};

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

test('POST /suggestions succeeds with valid API key', async () => {
  const res = await api
    .post('/suggestions')
    .set('X-API-Key', 'testkey')
    .send({ player: 'A', message: 'hi', category: 'feature' });
  assert.equal(res.status, 200);
  assert.equal(res.body.player, 'A');
  assert.equal(res.body.message, 'hi');
});
