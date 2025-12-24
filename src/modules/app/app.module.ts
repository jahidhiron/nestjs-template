import { CronModule } from '@/cron/cron.module';
import { DatabaseModule } from '@/db/database.module';
import { HealthModule } from '@/modules/healths/health.module';
import { RealtimeModule } from '@/realtime/realtime.module';
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
    HealthModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
