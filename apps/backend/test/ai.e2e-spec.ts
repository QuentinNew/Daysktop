import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { AiModule } from '../src/ai/ai.module.js';
import { AiController } from '../src/ai/ai.controller.js';
import { AiService, MAX_RESULTS } from '../src/ai/ai.service.js';

describe('Ai (e2e)', () => {
  let prisma: PrismaService;
  let aiService: AiService;
  let controller: AiController;
  let userId: number;
  let otherUserId: number;
  let moodId: number;
  let activitySportId: number;
  let activityFriendsId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AiModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    aiService = app.get(AiService);
    controller = app.get(AiController);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "media_months", "media", "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    const user = await prisma.user.create({ data: { username: 'default' } });
    userId = user.id;
    const otherUser = await prisma.user.create({ data: { username: 'other' } });
    otherUserId = otherUser.id;

    const mood = await prisma.mood.create({ data: { name: 'Happy', moodGroupId: 1 } });
    moodId = mood.id;

    const group = await prisma.group.create({ data: { userId, name: 'Social' } });
    const sport = await prisma.activity.create({ data: { userId, groupId: group.id, name: 'sport' } });
    const friends = await prisma.activity.create({ data: { userId, groupId: group.id, name: 'amis' } });
    activitySportId = sport.id;
    activityFriendsId = friends.id;
  });

  async function createEntry(
    date: string,
    options: { note?: string; moodId?: number; activityIds?: number[]; isFavorite?: boolean; forUserId?: number } = {},
  ) {
    return prisma.entry.create({
      data: {
        userId: options.forUserId ?? userId,
        localDate: new Date(date),
        note: options.note,
        moodId: options.moodId,
        isFavorite: options.isFavorite ?? false,
        activities: options.activityIds ? { connect: options.activityIds.map((id) => ({ id })) } : undefined,
      },
    });
  }

  describe('findByDate', () => {
    it('returns a cleaned entry for an existing date', async () => {
      await createEntry('2026-08-31', { note: 'Great day', moodId, activityIds: [activitySportId] });

      const result = await aiService.findByDate(userId, new Date('2026-08-31'));

      expect(result).toEqual({
        date: '2026-08-31',
        note: 'Great day',
        mood: 'Happy',
        activities: ['sport'],
        isFavorite: false,
      });
    });

    it('returns null when no entry exists for that date', async () => {
      const result = await aiService.findByDate(userId, new Date('2026-08-31'));

      expect(result).toBeNull();
    });

    it("does not leak another user's entry", async () => {
      await createEntry('2026-08-31', { note: 'Not mine', forUserId: otherUserId });

      const result = await aiService.findByDate(userId, new Date('2026-08-31'));

      expect(result).toBeNull();
    });
  });

  describe('findByRange', () => {
    it('returns entries within the range ordered by date desc', async () => {
      await createEntry('2026-08-01', { note: 'first' });
      await createEntry('2026-08-02', { note: 'second' });
      await createEntry('2026-09-01', { note: 'out of range' });

      const result = await aiService.findByRange(userId, new Date('2026-08-01'), new Date('2026-08-31'));

      expect(result.map((entry) => entry.date)).toEqual(['2026-08-02', '2026-08-01']);
    });

    it('caps results at MAX_RESULTS, keeping the most recent', async () => {
      for (let day = 1; day <= 31; day++) {
        await createEntry(`2026-01-${String(day).padStart(2, '0')}`);
      }

      const result = await aiService.findByRange(userId, new Date('2026-01-01'), new Date('2026-01-31'));

      expect(result).toHaveLength(MAX_RESULTS);
      expect(result[0]?.date).toBe('2026-01-31');
    });
  });

  describe('search', () => {
    it('filters by mood name, case-insensitive', async () => {
      await createEntry('2026-08-01', { moodId });
      await createEntry('2026-08-02');

      const result = await aiService.search(userId, { mood: 'happy' });

      expect(result.map((entry) => entry.date)).toEqual(['2026-08-01']);
    });

    it('filters by activities with OR semantics', async () => {
      await createEntry('2026-08-01', { activityIds: [activitySportId] });
      await createEntry('2026-08-02', { activityIds: [activityFriendsId] });
      await createEntry('2026-08-03');

      const result = await aiService.search(userId, { activities: ['sport', 'amis'] });

      expect(result.map((entry) => entry.date).sort()).toEqual(['2026-08-01', '2026-08-02']);
    });

    it('filters by keyword in the note, case-insensitive', async () => {
      await createEntry('2026-08-01', { note: 'Went for a Run today' });
      await createEntry('2026-08-02', { note: 'Stayed home' });

      const result = await aiService.search(userId, { keyword: 'run' });

      expect(result.map((entry) => entry.date)).toEqual(['2026-08-01']);
    });

    it('combines mood, activities and keyword filters together', async () => {
      await createEntry('2026-08-01', { note: 'Great run', moodId, activityIds: [activitySportId] });
      await createEntry('2026-08-02', { note: 'Great run', activityIds: [activitySportId] });

      const result = await aiService.search(userId, { mood: 'happy', activities: ['sport'], keyword: 'run' });

      expect(result.map((entry) => entry.date)).toEqual(['2026-08-01']);
    });

    it('restricts to an optional date range when provided', async () => {
      await createEntry('2026-08-01', { moodId });
      await createEntry('2026-09-01', { moodId });

      const result = await aiService.search(userId, {
        mood: 'happy',
        from: new Date('2026-08-01'),
        to: new Date('2026-08-31'),
      });

      expect(result.map((entry) => entry.date)).toEqual(['2026-08-01']);
    });

    it('caps results at MAX_RESULTS', async () => {
      for (let day = 1; day <= 31; day++) {
        await createEntry(`2026-01-${String(day).padStart(2, '0')}`, { moodId });
      }

      const result = await aiService.search(userId, { mood: 'happy' });

      expect(result).toHaveLength(MAX_RESULTS);
    });
  });
});

describe('Ai controller validation (e2e)', () => {
  let prisma: PrismaService;
  let controller: AiController;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AiModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    controller = app.get(AiController);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "media_months", "media", "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    await prisma.user.create({ data: { username: 'default' } });
  });

  it('rejects a malformed date on findByDate', async () => {
    await expect(controller.findByDate('2026-8-1')).rejects.toThrow(BadRequestException);
  });

  it('rejects findByRange when from is missing', async () => {
    await expect(controller.findByRange(undefined as unknown as string, '2026-08-31')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects findByRange when to is missing', async () => {
    await expect(controller.findByRange('2026-08-01', undefined as unknown as string)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects a malformed date on findByRange', async () => {
    await expect(controller.findByRange('2026/08/01', '2026-08-31')).rejects.toThrow(BadRequestException);
  });

  it('does not require from/to on search', async () => {
    await expect(controller.search()).resolves.toEqual([]);
  });
});
