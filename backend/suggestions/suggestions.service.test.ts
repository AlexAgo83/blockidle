import test from 'node:test';
import assert from 'node:assert/strict';
import { SuggestionsService } from './suggestions.service.js';
import type { DatabaseService } from '../database/database.service.js';

class MockDb implements Partial<DatabaseService> {
  lastQueryParams: any[] = [];

  async query(_text: string, params: any[] = []) {
    this.lastQueryParams = params;
    return {
      rowCount: 1,
      rows: [
        {
          id: 1,
          player: params[0],
          category: params[1],
          message: params[2],
          status: params[3],
          created_at: new Date().toISOString()
        }
      ]
    } as any;
  }
}

test('list clamps limit to 50', async () => {
  const db = new MockDb();
  const service = new SuggestionsService(db as DatabaseService);
  await service.list(999);
  assert.equal(db.lastQueryParams[0], 50);
});

test('create rejects missing player or message', async () => {
  const db = new MockDb();
  const service = new SuggestionsService(db as DatabaseService);
  await assert.rejects(() => service.create({ player: 'Valid', message: '' } as any), /message requis/);
  await assert.rejects(() => service.create({ player: '!!!!', message: 'hi' } as any), /player requis/);
});

test('create defaults category and truncates message', async () => {
  const db = new MockDb();
  const service = new SuggestionsService(db as DatabaseService);
  const longMessage = 'A'.repeat(1200);
  await service.create({
    player: '  $$Player  ',
    message: longMessage,
    category: 'invalid'
  });

  const [player, category, message, status] = db.lastQueryParams;
  assert.equal(player, 'Player');
  assert.equal(category, 'feature'); // defaulted
  assert.equal(message.length, 1000); // truncated
  assert.equal(status, 'open');
});
