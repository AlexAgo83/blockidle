import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { sanitizePlayerName } from '../common/sanitize.util.js';
import { CreateSuggestionDto } from './dto/create-suggestion.dto.js';

const ALLOWED_SUGGESTION_CATEGORIES = ['feature', 'bug'];
const ALLOWED_STATUSES = ['open', 'done', 'rejected'];

@Injectable()
export class SuggestionsService {
  constructor(private readonly db: DatabaseService) {}

  async list(limit = 10) {
    const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
    const result = await this.db.query(
      `
        SELECT id, player, category, message, status, created_at
        FROM suggestions
        ORDER BY created_at DESC
        LIMIT $1
      `,
      [safeLimit]
    );
    return result.rows;
  }

  async create(payload: CreateSuggestionDto) {
    const name = sanitizePlayerName(payload.player);
    if (!name) throw new Error('player requis');
    if (!payload.message || typeof payload.message !== 'string' || !payload.message.trim()) {
      throw new Error('message requis');
    }
    const text = payload.message.trim().slice(0, 1000);
    const cat = ALLOWED_SUGGESTION_CATEGORIES.includes((payload.category || '').trim())
      ? (payload.category || '').trim()
      : 'feature';
    const status = 'open';

    const result = await this.db.query(
      `
        INSERT INTO suggestions (player, category, message, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, player, category, message, status, created_at
      `,
      [name, cat, text, status]
    );
    return result.rows[0];
  }

  async delete(id: number) {
    const result = await this.db.query('DELETE FROM suggestions WHERE id = $1 RETURNING id', [id]);
    return result.rowCount ? { ok: true, id } : null;
  }

  async updateStatus(id: number, status: string) {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error('statut invalide');
    }
    const result = await this.db.query(
      `
        UPDATE suggestions
        SET status = $1
        WHERE id = $2
        RETURNING id, player, category, message, status, created_at
      `,
      [status, id]
    );
    return result.rows[0] || null;
  }
}
