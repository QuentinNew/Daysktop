import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export interface CreateMediaInput {
  name: string;
  picture: string;
  type: MediaType;
}

export interface UpdateMediaInput {
  name?: string;
  picture?: string;
  type?: MediaType;
}

export interface AssignMonthInput {
  year: number;
  month: number;
}

const MEDIA_INCLUDE = {
  months: true,
} as const;

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, input: CreateMediaInput) {
    return this.prisma.media.create({
      data: {
        userId,
        name: input.name,
        picture: input.picture,
        type: input.type,
      },
      include: MEDIA_INCLUDE,
    });
  }

  async findAll(userId: number) {
    return this.prisma.media.findMany({
      where: { userId },
      include: MEDIA_INCLUDE,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(userId: number, id: number) {
    const media = await this.prisma.media.findFirst({
      where: { id, userId },
      include: MEDIA_INCLUDE,
    });
    if (!media) {
      throw new NotFoundException(`Media ${id} not found`);
    }
    return media;
  }

  async update(userId: number, id: number, input: UpdateMediaInput) {
    await this.findOne(userId, id);
    return this.prisma.media.update({
      where: { id },
      data: {
        name: input.name,
        picture: input.picture,
        type: input.type,
      },
      include: MEDIA_INCLUDE,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.media.delete({ where: { id } });
  }

  async assignMonth(userId: number, id: number, input: AssignMonthInput) {
    await this.findOne(userId, id);
    await this.prisma.mediaMonth.upsert({
      where: {
        mediaId_year_month: { mediaId: id, year: input.year, month: input.month },
      },
      create: { mediaId: id, year: input.year, month: input.month },
      update: {},
    });
    return this.findOne(userId, id);
  }

  async unassignMonth(userId: number, id: number, year: number, month: number) {
    await this.findOne(userId, id);
    await this.prisma.mediaMonth.deleteMany({
      where: { mediaId: id, year, month },
    });
    return this.findOne(userId, id);
  }
}
