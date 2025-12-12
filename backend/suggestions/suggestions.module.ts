import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller.js';
import { SuggestionsService } from './suggestions.service.js';

@Module({
  controllers: [SuggestionsController],
  providers: [SuggestionsService]
})
export class SuggestionsModule {}
