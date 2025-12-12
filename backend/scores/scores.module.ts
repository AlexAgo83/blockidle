import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service.js';
import { ScoresController } from './scores.controller.js';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService]
})
export class ScoresModule {}
