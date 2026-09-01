import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MoodsService } from './moods.service.js';

@Controller('moods')
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  @Get()
  async findAll(@Query('includeArchived') includeArchived?: string) {
    return this.moodsService.findAll({ includeArchived: includeArchived === 'true' });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moodsService.findOne(id);
  }
}
