import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key.guard.js';
import { CreateScoreDto } from './dto/create-score.dto.js';
import { ScoresService } from './scores.service.js';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const value = Number(limit) || 10;
    return this.scoresService.list(value);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  async create(@Body() dto: CreateScoreDto) {
    try {
      return await this.scoresService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Invalid payload');
    }
  }
}
