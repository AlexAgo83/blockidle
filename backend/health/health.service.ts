import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class HealthService {
  constructor(private readonly db: DatabaseService) {}

  async check() {
    try {
      await this.db.query('SELECT 1');
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'DB KO' };
    }
  }
}
