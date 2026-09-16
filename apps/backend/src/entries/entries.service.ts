import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface FindAllEntriesOptions {
  from?: Date;
  to?: Date;
  keyword?: string;
  activityIds?: number[];
}

const ENTRY_INCLUDE = {
  mood: true,
  activities: true,
} as const;

@Injectable()
export class EntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, options: FindAllEntriesOptions = {}) {
    return this.prisma.entry.findMany({
      where: {
        userId,
        localDate: {
          gte: options.from,
          lte: options.to,
        },
        ...(options.keyword && {
          note: { contains: options.keyword, mode: 'insensitive' },
        }),
        ...(options.activityIds &&
          options.activityIds.length > 0 && {
            AND: options.activityIds.map((id) => ({ activities: { some: { id } } })),
          }),
      },
      include: ENTRY_INCLUDE,
      orderBy: { localDate: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const entry = await this.prisma.entry.findFirst({
      where: { id, userId },
      include: ENTRY_INCLUDE,
    });
    if (!entry) {
      throw new NotFoundException(`Entry ${id} not found`);
    }
    return entry;
  }
}
