import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EntriesService } from './entries.service.js';

function parseDateParam(value: string | undefined, paramName: string): Date | undefined {
  if (value === undefined) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`Invalid ${paramName} date`);
  }
  return date;
}

@Controller('entries')
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async findAll(@Query('from') from?: string, @Query('to') to?: string) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.entriesService.findAll(user.id, {
      from: parseDateParam(from, 'from'),
      to: parseDateParam(to, 'to'),
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.entriesService.findOne(user.id, id);
  }
}
