import { HTTP_STATUS } from '@/common/constants';
import { Injectable, Scope } from '@nestjs/common';
import { AppResponse } from './interfaces';
import { ResponseService } from './response.service';
import { ResponseParams } from './types';

@Injectable({ scope: Scope.REQUEST })
export class SuccessResponse {
  constructor(private readonly responseService: ResponseService) {}

  ok<T extends object = any>(params: ResponseParams<T>): Promise<AppResponse<T>> {
    return this.responseService.success<T>(HTTP_STATUS.OK.context, params);
  }

  created<T extends object = any>(params: ResponseParams<T>): Promise<AppResponse<T>> {
    return this.responseService.success<T>(HTTP_STATUS.CREATED.context, params);
  }

  accepted<T extends object = any>(params: ResponseParams<T>): Promise<AppResponse<T>> {
    return this.responseService.success<T>(HTTP_STATUS.ACCEPTED.context, params);
  }

  noContent<T extends object = any>(params: ResponseParams<T>): Promise<AppResponse<T>> {
    return this.responseService.success<T>(HTTP_STATUS.NO_CONTENT.context, params);
  }
}
