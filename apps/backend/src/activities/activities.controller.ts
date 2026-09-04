import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActivitiesService } from './activities.service.js';

interface UpdateActivityBody {
  name?: unknown;
  icon?: unknown;
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

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async findAll(@Query('includeArchived') includeArchived?: string) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.activitiesService.findAll(user.id, {
      includeArchived: includeArchived === 'true',
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.activitiesService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateActivityBody) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.activitiesService.update(user.id, id, {
      name: parseOptionalString(body.name, 'name'),
      icon: parseOptionalString(body.icon, 'icon'),
    });
  }
}
