import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqConfigService {
  constructor(private configService: ConfigService) {}

  get rabbitmqUri(): string {
    return this.configService.get<string>('rabbitmqUrl') as string;
  }

  get rabbitmqQueue(): string {
    return this.configService.get<string>('rabbitmqQueue') as string;
  }
}
