import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { MediaService } from './media.service.js';

interface CreateMediaBody {
  name?: unknown;
  picture?: unknown;
  type?: unknown;
  zoom?: unknown;
  focalX?: unknown;
  focalY?: unknown;
}

interface UpdateMediaBody {
  name?: unknown;
  picture?: unknown;
  type?: unknown;
  zoom?: unknown;
  focalX?: unknown;
  focalY?: unknown;
}

interface AssignMonthBody {
  year?: unknown;
  month?: unknown;
}

function parseString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BadRequestException(`Invalid ${fieldName}`);
  }
  return value;
}

function parseOptionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return parseString(value, fieldName);
}

function parseMediaType(value: unknown): MediaType {
  if (typeof value !== 'string' || !Object.values(MediaType).includes(value as MediaType)) {
    throw new BadRequestException('Invalid type');
  }
  return value as MediaType;
}

function parseOptionalMediaType(value: unknown): MediaType | undefined {
  if (value === undefined) {
    return undefined;
  }
  return parseMediaType(value);
}

function parseOptionalNumber(value: unknown, fieldName: string, min: number, max: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
    throw new BadRequestException(`Invalid ${fieldName}`);
  }
  return value;
}

function parseMonthNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new BadRequestException(`Invalid ${fieldName}`);
  }
  return value;
}

function parseMonth(value: unknown): number {
  const month = parseMonthNumber(value, 'month');
  if (month < 1 || month > 12) {
    throw new BadRequestException('Invalid month');
  }
  return month;
}

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(@Body() body: CreateMediaBody) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.mediaService.create(user.id, {
      name: parseString(body.name, 'name'),
      picture: parseString(body.picture, 'picture'),
      type: parseMediaType(body.type),
      zoom: parseOptionalNumber(body.zoom, 'zoom', 1, 4),
      focalX: parseOptionalNumber(body.focalX, 'focalX', 0, 100),
      focalY: parseOptionalNumber(body.focalY, 'focalY', 0, 100),
    });
  }

  @Get()
  async findAll() {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.mediaService.findAll(user.id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMediaBody) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.mediaService.update(user.id, id, {
      name: parseOptionalString(body.name, 'name'),
      picture: parseOptionalString(body.picture, 'picture'),
      type: parseOptionalMediaType(body.type),
      zoom: parseOptionalNumber(body.zoom, 'zoom', 1, 4),
      focalX: parseOptionalNumber(body.focalX, 'focalX', 0, 100),
      focalY: parseOptionalNumber(body.focalY, 'focalY', 0, 100),
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.prisma.user.findFirstOrThrow();
    await this.mediaService.remove(user.id, id);
  }

  @Post(':id/months')
  async assignMonth(@Param('id', ParseIntPipe) id: number, @Body() body: AssignMonthBody) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.mediaService.assignMonth(user.id, id, {
      year: parseMonthNumber(body.year, 'year'),
      month: parseMonth(body.month),
    });
  }

  @Delete(':id/months/:year/:month')
  async unassignMonth(
    @Param('id', ParseIntPipe) id: number,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.mediaService.unassignMonth(user.id, id, year, month);
  }
}
