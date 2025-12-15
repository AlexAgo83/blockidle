import test from 'node:test';
import assert from 'node:assert/strict';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard.js';

function makeContext(header?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: header ? { 'x-api-key': header } : {}
      })
    })
  } as any;
}

test('ApiKeyGuard rejects when no API key configured', () => {
  const prev = process.env.API_KEYS;
  delete process.env.API_KEYS;
  const guard = new ApiKeyGuard();
  assert.throws(() => guard.canActivate(makeContext('abc')), UnauthorizedException);
  if (prev !== undefined) process.env.API_KEYS = prev;
});

test('ApiKeyGuard allows valid key', () => {
  process.env.API_KEYS = 'a, b';
  const guard = new ApiKeyGuard();
  assert.equal(guard.canActivate(makeContext('b')), true);
});

test('ApiKeyGuard rejects invalid key', () => {
  process.env.API_KEYS = 'a, b';
  const guard = new ApiKeyGuard();
  assert.throws(() => guard.canActivate(makeContext('zzz')), ForbiddenException);
});
