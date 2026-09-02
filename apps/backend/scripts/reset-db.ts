import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
await prisma.$executeRawUnsafe(
  'TRUNCATE TABLE "entries", "activities", "moods", "groups", "users" RESTART IDENTITY CASCADE',
);
await prisma.user.create({ data: { username: 'default' } });
console.log('Database cleared, default user recreated.');
await prisma.$disconnect();
