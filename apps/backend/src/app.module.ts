import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ImportModule } from './import/import.module.js';

@Module({
  imports: [PrismaModule, ImportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
