import { AppConfigService } from '@/config/app';
import { DbConfigService } from '@/config/db';
import { RabbitmqConfigService } from '@/config/rabbitmq';
import { RealtimeConfigService } from '@/config/realtime';
import { SwaggerConfigService } from '@/config/swagger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor(
    public readonly app: AppConfigService,
    public readonly swagger: SwaggerConfigService,
    public readonly db: DbConfigService,
    public readonly rabbitmq: RabbitmqConfigService,
    public readonly realtime: RealtimeConfigService,
  ) {}
}
