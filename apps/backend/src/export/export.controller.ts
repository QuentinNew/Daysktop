import { Controller, Get, Header } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ExportService } from './export.service.js';

@Controller('export')
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="daysktop-export.json"')
  async export() {
    const user = await this.prisma.user.findFirstOrThrow();
    return this.exportService.exportBackup(user.id);
  }
}
