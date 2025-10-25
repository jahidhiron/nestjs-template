import { AppConfigService } from '@/config/app';
import { DbConfigService } from '@/config/db';
import { SwaggerConfigService } from '@/config/swagger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor(
    public readonly app: AppConfigService,
    public readonly swagger: SwaggerConfigService,
    public readonly db: DbConfigService,
  ) {}
}
