import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { ScoresModule } from './scores/scores.module.js';
import { SuggestionsModule } from './suggestions/suggestions.module.js';
import { CommitsModule } from './commits/commits.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [DatabaseModule, ScoresModule, SuggestionsModule, CommitsModule, HealthModule]
})
export class AppModule {}
