import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface FindAllActivitiesOptions {
  includeArchived?: boolean;
}

export interface UpdateActivityInput {
  name?: string;
  icon?: string;
}

const ACTIVITY_INCLUDE = {
  group: true,
} as const;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, options: FindAllActivitiesOptions = {}) {
    return this.prisma.activity.findMany({
      where: {
        userId,
        archived: options.includeArchived ? undefined : false,
      },
      include: ACTIVITY_INCLUDE,
      orderBy: [{ group: { order: 'asc' } }, { order: 'asc' }],
    });
  }

  async findOne(userId: number, id: number) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, userId },
      include: ACTIVITY_INCLUDE,
    });
    if (!activity) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
    return activity;
  }

  async update(userId: number, id: number, input: UpdateActivityInput) {
    await this.findOne(userId, id);
    return this.prisma.activity.update({
      where: { id },
      data: {
        name: input.name,
        icon: input.icon,
      },
      include: ACTIVITY_INCLUDE,
    });
  }
}
