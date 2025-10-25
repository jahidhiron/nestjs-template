import { HTTP_STATUS } from '@/common/constants';
import { HttpException, Injectable, Scope } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseParams } from './types';

@Injectable({ scope: Scope.REQUEST })
export class ErrorResponse {
  constructor(private readonly responseService: ResponseService) {}

  async badRequest<T extends object = any>(params: ResponseParams<T>): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Bad Request';
    }

    const response = await this.responseService.error<T>(HTTP_STATUS.BAD_REQUEST.context, params);
    throw new HttpException(response, HTTP_STATUS.BAD_REQUEST.status);
  }

  async unauthorized<T extends object = any>(
    params: ResponseParams<T> = {} as ResponseParams<T>,
  ): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Unauthorized';
    }

    const response = await this.responseService.error<T>(HTTP_STATUS.UNAUTHORIZED.context, params);
    throw new HttpException(response, HTTP_STATUS.UNAUTHORIZED.status);
  }

  async forbidden<T extends object = any>(params: ResponseParams<T>): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Forbidden';
    }

    const response = await this.responseService.error<T>(HTTP_STATUS.FORBIDDEN.context, params);
    throw new HttpException(response, HTTP_STATUS.FORBIDDEN.status);
  }

  async notFound<T extends object = any>(params: ResponseParams<T>): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Not Found';
    }

    const response = await this.responseService.error<T>(HTTP_STATUS.NOT_FOUND.context, params);
    throw new HttpException(response, HTTP_STATUS.NOT_FOUND.status);
  }

  async conflict<T extends object = any>(params: ResponseParams<T>): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Conflict';
    }

    const response = await this.responseService.error<T>(HTTP_STATUS.CONFLICT.context, params);
    throw new HttpException(response, HTTP_STATUS.CONFLICT.status);
  }

  async tooManyRequests<T extends object = any>(
    params: ResponseParams<T> = {} as ResponseParams<T>,
  ): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Too Many Request';
    }

    const response = await this.responseService.error<T>(
      HTTP_STATUS.TOO_MANY_REQUESTS.context,
      params,
    );
    throw new HttpException(response, HTTP_STATUS.TOO_MANY_REQUESTS.status);
  }

  async requestTimeout<T extends object = any>(
    params: ResponseParams<T> = {} as ResponseParams<T>,
  ): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Unable to process your request at the moment please try later';
    }

    const response = await this.responseService.error<T>(
      HTTP_STATUS.REQUEST_TIMEOUT.context,
      params,
    );
    throw new HttpException(response, HTTP_STATUS.REQUEST_TIMEOUT.status);
  }

  serviceUnavailable<T extends object = any>(
    params: ResponseParams<T> = {} as ResponseParams<T>,
  ): Promise<never> {
    params.message ||= 'Service Unavailable. Please try again later.';
    throw new HttpException(
      HTTP_STATUS.SERVICE_UNAVAILABLE.context,
      HTTP_STATUS.SERVICE_UNAVAILABLE.status,
      params,
    );
  }

  async internalServerError<T extends object = any>(params: ResponseParams<T>): Promise<never> {
    if (!params.key && !params.message) {
      params.message = 'Internal Server Error';
    }

    const response = await this.responseService.error<T>(
      HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
      params,
    );
    throw new HttpException(response, HTTP_STATUS.INTERNAL_SERVER_ERROR.status);
  }
}
