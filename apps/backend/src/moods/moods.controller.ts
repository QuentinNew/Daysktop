import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { MoodsService } from './moods.service.js';

interface UpdateMoodBody {
  name?: unknown;
  color?: unknown;
}

function parseOptionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new BadRequestException(`Invalid ${fieldName}`);
  }
  return value;
}

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

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMoodBody) {
    return this.moodsService.update(id, {
      name: parseOptionalString(body.name, 'name'),
      color: parseOptionalString(body.color, 'color'),
    });
  }
}
