import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface FindAllMoodsOptions {
  includeArchived?: boolean;
}

export interface UpdateMoodInput {
  name?: string;
  color?: string;
}

@Injectable()
export class MoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindAllMoodsOptions = {}) {
    return this.prisma.mood.findMany({
      where: {
        archived: options.includeArchived ? undefined : false,
      },
      orderBy: [{ moodGroupId: 'asc' }, { order: 'asc' }],
    });
  }

  async findOne(id: number) {
    const mood = await this.prisma.mood.findUnique({ where: { id } });
    if (!mood) {
      throw new NotFoundException(`Mood ${id} not found`);
    }
    return mood;
  }

  async update(id: number, input: UpdateMoodInput) {
    await this.findOne(id);
    return this.prisma.mood.update({
      where: { id },
      data: {
        name: input.name,
        color: input.color,
      },
    });
  }
}
