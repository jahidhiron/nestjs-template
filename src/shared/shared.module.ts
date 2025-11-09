import { HttpClientService } from '@/shared/http-client';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { TokenService } from './hash/token.service';
import { ErrorResponse, SuccessResponse } from './responses';
import { ResponseService } from './responses/response.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    ResponseService,
    SuccessResponse,
    ErrorResponse,
    HashService,
    TokenService,
    HttpClientService,
  ],
  exports: [SuccessResponse, ErrorResponse, HashService, TokenService, HttpClientService],
})
export class SharedModule {}
