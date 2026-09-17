import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { toAiEntry, type AiEntry } from './ai-entry.dto.js';

export const MAX_RESULTS = 30;

const ENTRY_INCLUDE = {
  mood: true,
  activities: true,
} as const;

export interface SearchEntriesOptions {
  mood?: string;
  activities?: string[];
  keyword?: string;
  from?: Date;
  to?: Date;
}

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async findByDate(userId: number, date: Date): Promise<AiEntry | null> {
    const entry = await this.prisma.entry.findUnique({
      where: { userId_localDate: { userId, localDate: date } },
      include: ENTRY_INCLUDE,
    });
    return entry ? toAiEntry(entry) : null;
  }

  async findByRange(userId: number, from: Date, to: Date): Promise<AiEntry[]> {
    const entries = await this.prisma.entry.findMany({
      where: { userId, localDate: { gte: from, lte: to } },
      include: ENTRY_INCLUDE,
      orderBy: { localDate: 'desc' },
      take: MAX_RESULTS,
    });
    return entries.map(toAiEntry);
  }

  async search(userId: number, options: SearchEntriesOptions): Promise<AiEntry[]> {
    const where: Prisma.EntryWhereInput = {
      userId,
      localDate: { gte: options.from, lte: options.to },
    };
    if (options.mood) {
      where.mood = { name: { contains: options.mood, mode: 'insensitive' } };
    }
    if (options.activities && options.activities.length > 0) {
      where.activities = {
        some: { name: { in: options.activities, mode: 'insensitive' } },
      };
    }
    if (options.keyword) {
      where.note = { contains: options.keyword, mode: 'insensitive' };
    }

    const entries = await this.prisma.entry.findMany({
      where,
      include: ENTRY_INCLUDE,
      orderBy: { localDate: 'desc' },
      take: MAX_RESULTS,
    });
    return entries.map(toAiEntry);
  }
}
