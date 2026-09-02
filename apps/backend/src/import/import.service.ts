import { readFile } from 'node:fs/promises';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { DaylioBackup, DaylioDayEntry } from './daylio-backup.types.js';
import { DaylioImportError } from './import.errors.js';

type PrismaTx = Prisma.TransactionClient;

const MOOD_GROUP_NAMES: Record<number, string> = {
  1: 'Super',
  2: 'Good',
  3: 'Meh',
  4: 'Bad',
  5: 'Horrible',
};

const MOOD_GROUP_COLORS: Record<number, string> = {
  1: '#2ba597',
  2: '#59d068',
  3: '#61bec7',
  4: '#ffad62',
  5: '#e66442',
};

export interface ImportResult {
  groupsImported: number;
  moodsImported: number;
  activitiesImported: number;
  entriesImported: number;
  entriesSkippedExisting: number;
  entriesSkippedCollision: number;
}

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importDaylioBackupFile(
    filePath: string,
    userId: number,
  ): Promise<ImportResult> {
    const raw = await readFile(filePath, 'utf-8');
    const backup = JSON.parse(raw) as DaylioBackup;
    return this.importDaylioBackup(backup, userId);
  }

  async importDaylioBackup(
    backup: DaylioBackup,
    userId: number,
  ): Promise<ImportResult> {
    return this.prisma.$transaction(
      async (tx) => {
        const groupIdByDaylioId = await this.importGroups(
          tx,
          backup.tag_groups,
          userId,
        );
        const moodIdByDaylioId = await this.importMoods(tx, backup.customMoods);
        const activityIdByDaylioId = await this.importActivities(
          tx,
          backup.tags,
          userId,
          groupIdByDaylioId,
        );

        const { entries, skippedCollision } = deduplicateByDay(
          backup.dayEntries,
        );

        let entriesImported = 0;
        let entriesSkippedExisting = 0;

        for (const dayEntry of entries) {
          const localDate = toLocalDate(dayEntry);

          const existing = await tx.entry.findUnique({
            where: { userId_localDate: { userId, localDate } },
          });
          if (existing) {
            entriesSkippedExisting++;
            continue;
          }

          const moodId = moodIdByDaylioId.get(dayEntry.mood);
          if (moodId === undefined) {
            throw new DaylioImportError(
              `dayEntry ${dayEntry.id} references unknown mood id ${dayEntry.mood}`,
            );
          }

          const activityIds = dayEntry.tags.map((tagId) => {
            const activityId = activityIdByDaylioId.get(tagId);
            if (activityId === undefined) {
              throw new DaylioImportError(
                `dayEntry ${dayEntry.id} references unknown tag id ${tagId}`,
              );
            }
            return activityId;
          });

          await tx.entry.create({
            data: {
              userId,
              localDate,
              note: dayEntry.note,
              isFavorite: dayEntry.isFavorite,
              moodId,
              activities: { connect: activityIds.map((id) => ({ id })) },
            },
          });
          entriesImported++;
        }

        return {
          groupsImported: groupIdByDaylioId.size,
          moodsImported: moodIdByDaylioId.size,
          activitiesImported: activityIdByDaylioId.size,
          entriesImported,
          entriesSkippedExisting,
          entriesSkippedCollision: skippedCollision,
        };
      },
      { timeout: 120_000 },
    );
  }

  private async importGroups(
    tx: PrismaTx,
    tagGroups: DaylioBackup['tag_groups'],
    userId: number,
  ): Promise<Map<number, number>> {
    const idByDaylioId = new Map<number, number>();
    for (const tagGroup of tagGroups) {
      const group = await tx.group.upsert({
        where: { daylioId: tagGroup.id },
        update: { name: tagGroup.name, order: tagGroup.order },
        create: {
          daylioId: tagGroup.id,
          name: tagGroup.name,
          order: tagGroup.order,
          userId,
        },
      });
      idByDaylioId.set(tagGroup.id, group.id);
    }
    return idByDaylioId;
  }

  private async importMoods(
    tx: PrismaTx,
    customMoods: DaylioBackup['customMoods'],
  ): Promise<Map<number, number>> {
    const idByDaylioId = new Map<number, number>();
    for (const customMood of customMoods) {
      const name =
        customMood.custom_name || MOOD_GROUP_NAMES[customMood.mood_group_id];
      const color = MOOD_GROUP_COLORS[customMood.mood_group_id] ?? null;
      const mood = await tx.mood.upsert({
        where: { daylioId: customMood.id },
        update: {
          name,
          icon: String(customMood.icon_id),
          moodGroupId: customMood.mood_group_id,
          order: customMood.mood_group_order,
          archived: customMood.state === 1,
          color,
        },
        create: {
          daylioId: customMood.id,
          name,
          icon: String(customMood.icon_id),
          moodGroupId: customMood.mood_group_id,
          order: customMood.mood_group_order,
          archived: customMood.state === 1,
          color,
        },
      });
      idByDaylioId.set(customMood.id, mood.id);
    }
    return idByDaylioId;
  }

  private async importActivities(
    tx: PrismaTx,
    tags: DaylioBackup['tags'],
    userId: number,
    groupIdByDaylioId: Map<number, number>,
  ): Promise<Map<number, number>> {
    const idByDaylioId = new Map<number, number>();
    for (const tag of tags) {
      const groupId = groupIdByDaylioId.get(tag.id_tag_group);
      if (groupId === undefined) {
        throw new DaylioImportError(
          `tag ${tag.id} references unknown tag_group id ${tag.id_tag_group}`,
        );
      }
      const activity = await tx.activity.upsert({
        where: { daylioId: tag.id },
        update: {
          name: tag.name,
          icon: String(tag.icon),
          order: tag.order,
          archived: tag.state === 1,
          groupId,
        },
        create: {
          daylioId: tag.id,
          name: tag.name,
          icon: String(tag.icon),
          order: tag.order,
          archived: tag.state === 1,
          groupId,
          userId,
        },
      });
      idByDaylioId.set(tag.id, activity.id);
    }
    return idByDaylioId;
  }
}

function toLocalDate(dayEntry: DaylioDayEntry): Date {
  return new Date(Date.UTC(dayEntry.year, dayEntry.month, dayEntry.day));
}

function dayKey(dayEntry: DaylioDayEntry): string {
  return `${dayEntry.year}-${dayEntry.month}-${dayEntry.day}`;
}

function deduplicateByDay(dayEntries: DaylioDayEntry[]): {
  entries: DaylioDayEntry[];
  skippedCollision: number;
} {
  const earliestByDay = new Map<string, DaylioDayEntry>();
  let skippedCollision = 0;

  for (const dayEntry of dayEntries) {
    const key = dayKey(dayEntry);
    const current = earliestByDay.get(key);
    if (!current) {
      earliestByDay.set(key, dayEntry);
    } else if (dayEntry.datetime < current.datetime) {
      earliestByDay.set(key, dayEntry);
      skippedCollision++;
    } else {
      skippedCollision++;
    }
  }

  return { entries: [...earliestByDay.values()], skippedCollision };
}
