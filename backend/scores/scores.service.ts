import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { sanitizePlayerName } from '../common/sanitize.util.js';
import { CreateScoreDto } from './dto/create-score.dto.js';

@Injectable()
export class ScoresService {
  constructor(private readonly db: DatabaseService) {}

  async list(limit = 10) {
    const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const result = await this.db.query(
      `
        SELECT player, score, stage, level, ended_at, submitted_at, created_at, build, powers, talents, fusions
        FROM scores
        ORDER BY score DESC, ended_at ASC
        LIMIT $1
      `,
      [safeLimit]
    );
    return result.rows;
  }

  async create(payload: CreateScoreDto) {
    const name = sanitizePlayerName(payload.player);
    if (!name) {
      throw new Error('player requis');
    }
    if (typeof payload.score !== 'number' || !Number.isFinite(payload.score)) {
      throw new Error('score numérique requis');
    }

    const safeStage = Number.isFinite(payload.stage) ? Math.max(1, Math.floor(Number(payload.stage))) : null;
    const safeLevel = Number.isFinite(payload.level) ? Math.max(1, Math.floor(Number(payload.level))) : null;
    const endedAtIso = (() => {
      const d = payload.endedAt ? new Date(payload.endedAt) : new Date();
      return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    })();
    const safeBuild = (payload.build || 'Old').slice(0, 32);
    const asStringList = (value?: string[]) => Array.isArray(value) ? value.filter((v) => typeof v === 'string').map((v) => v.slice(0, 64)).slice(0, 50) : [];
    const powers = JSON.stringify(asStringList(payload.powers));
    const talents = JSON.stringify(asStringList(payload.talents));
    const fusions = JSON.stringify(asStringList(payload.fusions));

    const result = await this.db.query(
      `
        INSERT INTO scores (player, score, stage, level, ended_at, build, powers, talents, fusions, submitted_at)
        VALUES ($1, $2, COALESCE($3, 1), COALESCE($4, 1), $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, now())
        ON CONFLICT (player, build)
        DO UPDATE SET
          score = GREATEST(scores.score, EXCLUDED.score),
          stage = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.stage ELSE scores.stage END,
          level = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.level ELSE scores.level END,
          ended_at = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.ended_at ELSE scores.ended_at END,
          build = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.build ELSE scores.build END,
          powers = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.powers ELSE scores.powers END,
          talents = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.talents ELSE scores.talents END,
          fusions = CASE WHEN EXCLUDED.score > scores.score THEN EXCLUDED.fusions ELSE scores.fusions END,
          submitted_at = now()
        RETURNING player, score, stage, level, ended_at, submitted_at, created_at, build, powers, talents, fusions
      `,
      [name, payload.score, safeStage, safeLevel, endedAtIso, safeBuild, powers, talents, fusions]
    );
    return result.rows[0];
  }
}
