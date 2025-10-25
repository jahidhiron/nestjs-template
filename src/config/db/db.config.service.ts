import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class DbConfigService {
  constructor(private configService: ConfigService) {}

  get type(): 'mysql' | 'mariadb' {
    return this.configService.get<'mysql' | 'mariadb'>('db.type')!;
  }

  get url(): string | undefined {
    return this.configService.get<string>('db.url');
  }

  get host(): string {
    return this.configService.get<string>('db.host')!;
  }

  get port(): number {
    return this.configService.get<number>('db.port')!;
  }

  get username(): string {
    return this.configService.get<string>('db.username')!;
  }

  get password(): string {
    return this.configService.get<string>('db.password')!;
  }

  get database(): string {
    return this.configService.get<string>('db.database')!;
  }

  get migrationsRun(): boolean {
    return this.configService.get<boolean>('db.migrationsRun')!;
  }

  get extra(): Partial<MysqlConnectionOptions['extra']> {
    return this.configService.get<Partial<MysqlConnectionOptions['extra']>>('db.extra') ?? {};
  }
  get bigNumberStrings(): boolean {
    return this.configService.get<boolean>('db.bigNumberStrings')!;
  }

  get charset(): string {
    return this.configService.get<string>('db.charset')!;
  }

  get connectTimeout(): number {
    return this.configService.get<number>('db.connectTimeout')!;
  }

  get retryAttempts(): number {
    return this.configService.get<number>('db.retryAttempts')!;
  }

  get retryDelay(): number {
    return this.configService.get<number>('db.retryDelay')!;
  }
}
