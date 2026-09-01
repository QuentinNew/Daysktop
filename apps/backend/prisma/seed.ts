import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEFAULT_USERNAME = 'default';

export async function seedDefaultUser() {
  return prisma.user.upsert({
    where: { username: DEFAULT_USERNAME },
    update: {},
    create: { username: DEFAULT_USERNAME },
  });
}

async function main() {
  await seedDefaultUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
