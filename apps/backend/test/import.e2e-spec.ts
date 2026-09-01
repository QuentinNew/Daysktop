import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { ImportModule } from '../src/import/import.module.js';
import { ImportService } from '../src/import/import.service.js';
import { DaylioImportError } from '../src/import/import.errors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => join(__dirname, 'fixtures', name);

describe('Daylio import (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let importService: ImportService;
  let userId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ImportModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    importService = app.get(ImportService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    const user = await prisma.user.create({ data: { username: 'default' } });
    userId = user.id;
  });

  it('imports groups, moods, activities and entries from a Daylio backup', async () => {
    const result = await importService.importDaylioBackupFile(fixture('daylio-basic.json'), userId);

    expect(result).toEqual({
      groupsImported: 2,
      moodsImported: 3,
      activitiesImported: 3,
      entriesImported: 2,
      entriesSkippedExisting: 0,
      entriesSkippedCollision: 0,
    });

    const groups = await prisma.group.findMany({ orderBy: { order: 'asc' } });
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ name: 'Feelings', order: 1, daylioId: 1 });
    expect(groups[1]).toMatchObject({ name: 'Health', order: 2, daylioId: 2 });

    const activities = await prisma.activity.findMany({ orderBy: { order: 'asc' } });
    expect(activities).toHaveLength(3);
    expect(activities.find((a) => a.daylioId === 10)).toMatchObject({
      name: 'happy',
      icon: '100',
      order: 1,
      archived: false,
    });
    expect(activities.find((a) => a.daylioId === 12)).toMatchObject({
      name: 'old-tag',
      archived: true,
    });

    const moods = await prisma.mood.findMany({ orderBy: { daylioId: 'asc' } });
    expect(moods).toHaveLength(3);
    expect(moods[0]).toMatchObject({
      name: 'Super',
      moodGroupId: 1,
      icon: '200',
      archived: false,
      color: null,
    });
    expect(moods[1]).toMatchObject({ name: 'Cheerful', moodGroupId: 2, archived: false });
    expect(moods[2]).toMatchObject({ name: 'Bad', moodGroupId: 4, archived: true });

    const entries = await prisma.entry.findMany({
      include: { activities: true, mood: true },
      orderBy: { localDate: 'asc' },
    });
    expect(entries).toHaveLength(2);

    const [first, second] = entries;
    expect(first.note).toBe('First entry<br><br>Feeling good.');
    expect(first.isFavorite).toBe(false);
    expect(first.mood?.name).toBe('Super');
    expect(first.activities.map((a) => a.name).sort()).toEqual(['happy', 'tired']);
    expect(first.localDate.toISOString().slice(0, 10)).toBe('2024-01-01');

    expect(second.note).toBe('Second entry');
    expect(second.isFavorite).toBe(true);
    expect(second.mood?.name).toBe('Cheerful');
    expect(second.activities.map((a) => a.name)).toEqual(['happy']);
    expect(second.localDate.toISOString().slice(0, 10)).toBe('2024-01-02');
  });

  it('is idempotent: re-running the same import adds nothing new', async () => {
    const first = await importService.importDaylioBackupFile(fixture('daylio-basic.json'), userId);
    expect(first.entriesImported).toBe(2);

    const second = await importService.importDaylioBackupFile(fixture('daylio-basic.json'), userId);
    expect(second).toEqual({
      groupsImported: 2,
      moodsImported: 3,
      activitiesImported: 3,
      entriesImported: 0,
      entriesSkippedExisting: 2,
      entriesSkippedCollision: 0,
    });

    expect(await prisma.group.count()).toBe(2);
    expect(await prisma.activity.count()).toBe(3);
    expect(await prisma.mood.count()).toBe(3);
    expect(await prisma.entry.count()).toBe(2);
  });

  it('keeps the earliest entry when two dayEntries fall on the same day', async () => {
    const result = await importService.importDaylioBackupFile(fixture('daylio-collision.json'), userId);

    expect(result.entriesImported).toBe(1);
    expect(result.entriesSkippedCollision).toBe(1);

    const entries = await prisma.entry.findMany();
    expect(entries).toHaveLength(1);
    expect(entries[0].note).toBe('Morning entry (earlier, should win)');
  });

  it('fails the whole import when a dayEntry references an unknown mood id', async () => {
    await expect(
      importService.importDaylioBackupFile(fixture('daylio-missing-mood.json'), userId),
    ).rejects.toThrow(DaylioImportError);

    expect(await prisma.entry.count()).toBe(0);
    expect(await prisma.mood.count()).toBe(0);
    expect(await prisma.activity.count()).toBe(0);
  });

  it('fails the whole import when a dayEntry references an unknown tag id', async () => {
    await expect(
      importService.importDaylioBackupFile(fixture('daylio-missing-tag.json'), userId),
    ).rejects.toThrow(DaylioImportError);

    expect(await prisma.entry.count()).toBe(0);
    expect(await prisma.mood.count()).toBe(0);
    expect(await prisma.activity.count()).toBe(0);
  });
});
