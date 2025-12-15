import test from 'node:test';
import assert from 'node:assert/strict';
import { ScoresService } from './scores.service.js';
import type { DatabaseService } from '../database/database.service.js';

class MockDb implements Partial<DatabaseService> {
  lastQueryParams: any[] = [];

  async query(_text: string, params: any[] = []) {
    this.lastQueryParams = params;
    const [player, score, stage, level, ended_at, build, powers, talents, fusions, pilot] = params;
    const now = new Date().toISOString();
    return {
      rowCount: 1,
      rows: [
        {
          player,
          score,
          stage,
          level,
          ended_at,
          submitted_at: now,
          created_at: now,
          build,
          powers,
          talents,
          fusions,
          pilot
        }
      ]
    } as any;
  }
}

test('list clamps limit to 100', async () => {
  const db = new MockDb();
  const service = new ScoresService(db as DatabaseService);
  await service.list(500);
  assert.equal(db.lastQueryParams[0], 100);
});

test('create rejects missing player or score', async () => {
  const db = new MockDb();
  const service = new ScoresService(db as DatabaseService);
  await assert.rejects(() => service.create({ player: 'ValidName' } as any), /score numérique requis/);
  await assert.rejects(() => service.create({ player: '!!!!', score: 10 } as any), /player requis/);
});

test('create sanitizes payload and truncates fields', async () => {
  const db = new MockDb();
  const service = new ScoresService(db as DatabaseService);
  const longStr = 'X'.repeat(80);
  const powers = Array.from({ length: 60 }, (_, i) => (i % 2 === 0 ? `Power-${i}` : 123 as any));
  const result = await service.create({
    player: '  $$A   B!!',
    score: 42,
    stage: 0,
    level: 2.7,
    endedAt: 'not-a-date',
    build: 'BuildNameThatIsLongerThanThirtyTwoChars',
    pilot: 'PilotNameThatIsDefinitelyLongerThan32Chars',
    powers,
    talents: [longStr],
    fusions: ['Fusion', 12 as any]
  });

  const [player, , stage, level, endedAtIso, build, powersParam, talentsParam, fusionsParam, pilot] =
    db.lastQueryParams;
  assert.equal(player, 'A B');
  assert.equal(stage, 1); // clamped to min 1
  assert.equal(level, 2); // floored
  assert.ok(!Number.isNaN(Date.parse(endedAtIso)));
  assert.equal(build.length, 32);
  assert.equal(pilot?.length, 32);

  const parsedPowers = JSON.parse(powersParam);
  assert.equal(parsedPowers.length, 30); // only string entries kept, capped below 50
  assert.ok(parsedPowers.every((p: string) => typeof p === 'string' && p.length <= 64));

  const parsedTalents = JSON.parse(talentsParam);
  assert.equal(parsedTalents[0].length, 64); // truncated

  const parsedFusions = JSON.parse(fusionsParam);
  assert.deepEqual(parsedFusions, ['Fusion']);

  assert.equal(result.player, 'A B');
  assert.equal(result.stage, 1);
  assert.equal(result.level, 2);
});
