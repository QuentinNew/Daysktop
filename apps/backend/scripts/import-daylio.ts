import { PrismaClient } from '@prisma/client';
import { ImportService } from '../src/import/import.service.js';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: tsx scripts/import-daylio.ts <path-to-.daylio-file>');
  process.exit(1);
}

const prisma = new PrismaClient();
const importService = new ImportService(prisma as never);

const user = await prisma.user.findUniqueOrThrow({ where: { username: 'default' } });

const result = await importService.importDaylioBackupFile(filePath, user.id);
console.log(result);

await prisma.$disconnect();
