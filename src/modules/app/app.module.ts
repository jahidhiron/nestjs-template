import { CronModule } from '@/cron/cron.module';
import { DatabaseModule } from '@/db/database.module';
import { ProjectModule } from '@/modules/projects/project.module';
import { SharedModule } from '@/shared';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from 'src/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    CronModule,
    SharedModule,
    DatabaseModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
