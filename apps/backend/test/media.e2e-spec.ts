import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { MediaModule } from '../src/media/media.module.js';
import { MediaService } from '../src/media/media.service.js';
import { MediaController } from '../src/media/media.controller.js';

describe('Media (e2e)', () => {
  let prisma: PrismaService;
  let mediaService: MediaService;
  let userId: number;
  let otherUserId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MediaModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    mediaService = app.get(MediaService);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "media_months", "media", "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    const user = await prisma.user.create({ data: { username: 'default' } });
    userId = user.id;
    const otherUser = await prisma.user.create({ data: { username: 'other' } });
    otherUserId = otherUser.id;
  });

  it('creates a media with no months assigned', async () => {
    const media = await mediaService.create(userId, {
      name: 'Genshin Impact',
      picture: 'https://picsum.photos/200',
      type: 'GAME',
    });

    expect(media).toMatchObject({
      name: 'Genshin Impact',
      picture: 'https://picsum.photos/200',
      type: 'GAME',
      months: [],
    });
  });

  it('lists only media belonging to the requesting user', async () => {
    await mediaService.create(userId, { name: 'Mine', picture: 'a.png', type: 'GAME' });
    await mediaService.create(otherUserId, { name: 'Not mine', picture: 'b.png', type: 'SERIE' });

    const result = await mediaService.findAll(userId);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Mine');
  });

  it('updates a media', async () => {
    const media = await mediaService.create(userId, { name: 'Old', picture: 'old.png', type: 'GAME' });

    const updated = await mediaService.update(userId, media.id, { name: 'New' });

    expect(updated).toMatchObject({ name: 'New', picture: 'old.png', type: 'GAME' });
  });

  it('throws when updating a media belonging to another user', async () => {
    const media = await mediaService.create(otherUserId, { name: 'Theirs', picture: 'x.png', type: 'OTHER' });

    await expect(mediaService.update(userId, media.id, { name: 'Hijacked' })).rejects.toThrow(NotFoundException);
  });

  it('deletes a media and cascades its month assignments', async () => {
    const media = await mediaService.create(userId, { name: 'Doomed', picture: 'x.png', type: 'GAME' });
    await mediaService.assignMonth(userId, media.id, { year: 2026, month: 3 });

    await mediaService.remove(userId, media.id);

    expect(await prisma.media.count()).toBe(0);
    expect(await prisma.mediaMonth.count()).toBe(0);
  });

  it('assigns a media to a month', async () => {
    const media = await mediaService.create(userId, { name: 'Elden Ring', picture: 'x.png', type: 'GAME' });

    const result = await mediaService.assignMonth(userId, media.id, { year: 2026, month: 5 });

    expect(result.months).toEqual([expect.objectContaining({ year: 2026, month: 5 })]);
  });

  it('is idempotent when assigning the same month twice', async () => {
    const media = await mediaService.create(userId, { name: 'Elden Ring', picture: 'x.png', type: 'GAME' });

    await mediaService.assignMonth(userId, media.id, { year: 2026, month: 5 });
    const result = await mediaService.assignMonth(userId, media.id, { year: 2026, month: 5 });

    expect(result.months).toHaveLength(1);
  });

  it('unassigns a media from a month', async () => {
    const media = await mediaService.create(userId, { name: 'Elden Ring', picture: 'x.png', type: 'GAME' });
    await mediaService.assignMonth(userId, media.id, { year: 2026, month: 5 });

    const result = await mediaService.unassignMonth(userId, media.id, 2026, 5);

    expect(result.months).toEqual([]);
  });

  it('allows a media to be assigned to multiple months', async () => {
    const media = await mediaService.create(userId, { name: 'Elden Ring', picture: 'x.png', type: 'GAME' });

    await mediaService.assignMonth(userId, media.id, { year: 2026, month: 5 });
    const result = await mediaService.assignMonth(userId, media.id, { year: 2026, month: 6 });

    expect(result.months.map((m) => m.month).sort()).toEqual([5, 6]);
  });

  it('throws when assigning a month to a media belonging to another user', async () => {
    const media = await mediaService.create(otherUserId, { name: 'Theirs', picture: 'x.png', type: 'OTHER' });

    await expect(mediaService.assignMonth(userId, media.id, { year: 2026, month: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws when deleting an unknown media', async () => {
    await expect(mediaService.remove(userId, 999)).rejects.toThrow(NotFoundException);
  });
});

describe('Media controller validation (e2e)', () => {
  let prisma: PrismaService;
  let controller: MediaController;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MediaModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    controller = app.get(MediaController);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "media_months", "media", "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
    );
    await prisma.user.create({ data: { username: 'default' } });
  });

  it('rejects an invalid type on create', async () => {
    await expect(controller.create({ name: 'X', picture: 'x.png', type: 'MOVIE' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects an out-of-range month on assign', async () => {
    const user = await prisma.user.findFirstOrThrow();
    const media = await prisma.media.create({ data: { userId: user.id, name: 'X', picture: 'x.png', type: 'GAME' } });

    await expect(controller.assignMonth(media.id, { year: 2026, month: 13 })).rejects.toThrow(BadRequestException);
  });
});
