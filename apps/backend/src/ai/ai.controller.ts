import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AiService } from './ai.service.js';

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string, paramName: string): Date {
  if (!DATE_FORMAT.test(value)) {
    throw new BadRequestException(`${paramName} must be a YYYY-MM-DD date`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${paramName} must be a valid date`);
  }
  return date;
}

@Controller('ai/entries')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('search')
  async search(
    @Query('mood') mood?: string,
    @Query('activities') activities?: string,
    @Query('keyword') keyword?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.aiService.search(user.id, {
      mood,
      activities: activities ? activities.split(',').map((activity) => activity.trim()) : undefined,
      keyword,
      from: from ? parseDate(from, 'from') : undefined,
      to: to ? parseDate(to, 'to') : undefined,
    });
  }

  @Get(':date')
  async findByDate(@Param('date') date: string) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.aiService.findByDate(user.id, parseDate(date, 'date'));
  }

  @Get()
  async findByRange(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new BadRequestException('from and to are required');
    }
    const user = await this.prisma.user.findFirstOrThrow();
    return this.aiService.findByRange(user.id, parseDate(from, 'from'), parseDate(to, 'to'));
  }
}
