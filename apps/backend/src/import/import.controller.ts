import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service.js';
import { DaylioImportError } from './import.errors.js';
import { ImportService } from './import.service.js';
import type { DaylioBackup } from './daylio-backup.types.js';

@Controller('import')
export class ImportController {
  constructor(
    private readonly importService: ImportService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('daylio')
  @UseInterceptors(FileInterceptor('file'))
  async importDaylio(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Missing file upload (field "file")');
    }

    let backup: DaylioBackup;
    try {
      backup = JSON.parse(file.buffer.toString('utf-8'));
    } catch {
      throw new BadRequestException('Uploaded file is not valid JSON');
    }

    const user = await this.prisma.user.findFirstOrThrow();

    try {
      return await this.importService.importDaylioBackup(backup, user.id);
    } catch (error) {
      if (error instanceof DaylioImportError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
