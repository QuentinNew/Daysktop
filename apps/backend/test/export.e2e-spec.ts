import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { ImportModule } from '../src/import/import.module.js';
import { ImportService } from '../src/import/import.service.js';
import { ExportModule } from '../src/export/export.module.js';
import { ExportService } from '../src/export/export.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => join(__dirname, 'fixtures', name);

describe('Export (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let importService: ImportService;
  let exportService: ExportService;
  let userId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ImportModule, ExportModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    importService = app.get(ImportService);
    exportService = app.get(ExportService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "media_months", "media", "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    const user = await prisma.user.create({ data: { username: 'default' } });
    userId = user.id;
  });

  it('exports groups, moods, activities, entries and media in the Daylio-shaped format', async () => {
    await importService.importDaylioBackupFile(fixture('daylio-with-media.json'), userId);

    const backup = await exportService.exportBackup(userId);

    expect(backup.tag_groups).toEqual([{ id: 1, name: 'Feelings', order: 1 }]);
    expect(backup.tags).toEqual([
      { id: 10, name: 'happy', icon: 100, order: 1, state: 0, id_tag_group: 1 },
    ]);
    expect(backup.customMoods).toEqual([
      { id: 1, custom_name: 'Super', mood_group_id: 1, mood_group_order: 0, icon_id: 200, state: 0 },
    ]);
    expect(backup.dayEntries).toHaveLength(1);
    expect(backup.dayEntries[0]).toMatchObject({
      day: 1,
      month: 0,
      year: 2024,
      mood: 1,
      note: 'Entry with media',
      tags: [10],
      isFavorite: false,
    });
    expect(backup.media).toEqual([
      {
        id: 1,
        name: 'Elden Ring',
        picture: 'https://example.com/elden.png',
        type: 'GAME',
        zoom: 1.5,
        focalX: 40,
        focalY: 60,
        months: [{ year: 2024, month: 1 }],
      },
      {
        id: 2,
        name: 'Arcane',
        picture: 'https://example.com/arcane.png',
        type: 'SERIE',
        zoom: 1,
        focalX: 50,
        focalY: 50,
        months: [],
      },
    ]);
  });

  it('round-trips: re-importing its own export is idempotent for entries/tags and replaces media', async () => {
    await importService.importDaylioBackupFile(fixture('daylio-with-media.json'), userId);
    const backup = await exportService.exportBackup(userId);

    const result = await importService.importDaylioBackup(backup, userId);

    expect(result).toEqual({
      groupsImported: 1,
      moodsImported: 1,
      activitiesImported: 1,
      entriesImported: 0,
      entriesSkippedExisting: 1,
      entriesSkippedCollision: 0,
      mediaImported: 2,
    });

    expect(await prisma.group.count()).toBe(1);
    expect(await prisma.activity.count()).toBe(1);
    expect(await prisma.mood.count()).toBe(1);
    expect(await prisma.entry.count()).toBe(1);
    expect(await prisma.media.count()).toBe(2);
  });
});
