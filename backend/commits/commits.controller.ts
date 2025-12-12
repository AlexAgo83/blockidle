import { Controller, Get, Query } from '@nestjs/common';
import { CommitsService } from './commits.service.js';

@Controller('commits')
export class CommitsController {
  constructor(private readonly commitsService: CommitsService) {}

  @Get()
  async list(@Query('limit') limit?: string) {
    const value = Number(limit) || 10;
    return this.commitsService.list(value);
  }
}
