import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { TokenService } from './hash/token.service';
import { ErrorResponse, SuccessResponse } from './responses';
import { ResponseService } from './responses/response.service';

@Global()
@Module({
  providers: [ResponseService, SuccessResponse, ErrorResponse, HashService, TokenService],
  exports: [SuccessResponse, ErrorResponse, HashService, TokenService],
})
export class SharedModule {}
