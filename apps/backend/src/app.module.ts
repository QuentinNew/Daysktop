import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ImportModule } from './import/import.module.js';
import { EntriesModule } from './entries/entries.module.js';
import { ActivitiesModule } from './activities/activities.module.js';
import { MoodsModule } from './moods/moods.module.js';
import { MediaModule } from './media/media.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [PrismaModule, ImportModule, EntriesModule, ActivitiesModule, MoodsModule, MediaModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
