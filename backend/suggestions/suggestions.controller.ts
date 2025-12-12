import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key.guard.js';
import { CreateSuggestionDto } from './dto/create-suggestion.dto.js';
import { UpdateSuggestionStatusDto } from './dto/update-suggestion-status.dto.js';
import { SuggestionsService } from './suggestions.service.js';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const value = Number(limit) || 10;
    return this.suggestionsService.list(value);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  async create(@Body() dto: CreateSuggestionDto) {
    try {
      return await this.suggestionsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Invalid payload');
    }
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async remove(@Param('id') idParam: string) {
    const id = Number(idParam);
    if (!Number.isFinite(id) || id <= 0) {
      throw new BadRequestException('id invalide');
    }
    const result = await this.suggestionsService.delete(id);
    if (!result) {
      throw new BadRequestException('Not found');
    }
    return result;
  }

  @Patch(':id/status')
  @UseGuards(ApiKeyGuard)
  async updateStatus(@Param('id') idParam: string, @Body() dto: UpdateSuggestionStatusDto) {
    const id = Number(idParam);
    if (!Number.isFinite(id) || id <= 0) {
      throw new BadRequestException('id invalide');
    }
    try {
      const result = await this.suggestionsService.updateStatus(id, dto.status);
      if (!result) {
        throw new BadRequestException('Not found');
      }
      return result;
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Invalid payload');
    }
  }
}
