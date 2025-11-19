import { ModuleName } from '@/common/enums';
import { AppStatusSwaggerDocs } from '@/modules/app/swaggers';
import { SuccessResponse } from '@/shared/responses';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly successResponse: SuccessResponse,
  ) {}

  @Get('status')
  @AppStatusSwaggerDocs()
  appStatus() {
    const result = this.appService.appStatus();
    return this.successResponse.ok({ module: ModuleName.App, key: 'app-status', ...result });
  }
}
