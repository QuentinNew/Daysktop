import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { DaylioBackup } from '../import/daylio-backup.types.js';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportBackup(userId: number): Promise<DaylioBackup> {
    const [groups, activities, moods, entries, media] = await Promise.all([
      this.prisma.group.findMany({ where: { userId }, orderBy: { id: 'asc' } }),
      this.prisma.activity.findMany({ where: { userId }, orderBy: { id: 'asc' } }),
      this.prisma.mood.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.entry.findMany({
        where: { userId },
        include: { activities: true },
        orderBy: { localDate: 'asc' },
      }),
      this.prisma.media.findMany({
        where: { userId },
        include: { months: true },
        orderBy: { id: 'asc' },
      }),
    ]);

    const groupExportId = new Map(groups.map((g) => [g.id, g.daylioId ?? g.id]));
    const activityExportId = new Map(activities.map((a) => [a.id, a.daylioId ?? a.id]));
    const moodExportId = new Map(moods.map((m) => [m.id, m.daylioId ?? m.id]));

    return {
      tag_groups: groups.map((g) => ({
        id: groupExportId.get(g.id)!,
        name: g.name,
        order: g.order,
      })),
      tags: activities.map((a) => ({
        id: activityExportId.get(a.id)!,
        name: a.name,
        icon: Number(a.icon) || 0,
        order: a.order,
        state: a.archived ? 1 : 0,
        id_tag_group: groupExportId.get(a.groupId)!,
      })),
      customMoods: moods.map((m) => ({
        id: moodExportId.get(m.id)!,
        custom_name: m.name,
        mood_group_id: m.moodGroupId,
        mood_group_order: m.order,
        icon_id: Number(m.icon) || 0,
        state: m.archived ? 1 : 0,
      })),
      dayEntries: entries.map((e) => ({
        id: e.id,
        month: e.localDate.getUTCMonth(),
        day: e.localDate.getUTCDate(),
        year: e.localDate.getUTCFullYear(),
        datetime: e.localDate.getTime(),
        mood: e.moodId !== null ? moodExportId.get(e.moodId)! : 0,
        note: e.note ?? '',
        tags: e.activities.map((a) => activityExportId.get(a.id)!),
        isFavorite: e.isFavorite,
      })),
      media: media.map((m) => ({
        id: m.id,
        name: m.name,
        picture: m.picture,
        type: m.type,
        zoom: m.zoom,
        focalX: m.focalX,
        focalY: m.focalY,
        months: m.months.map((mm) => ({ year: mm.year, month: mm.month })),
      })),
    };
  }
}
