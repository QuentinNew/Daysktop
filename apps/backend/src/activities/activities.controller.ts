import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActivitiesService } from './activities.service.js';

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
}
