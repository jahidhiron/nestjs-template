/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HTTP_STATUS } from '@/common/constants';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { AppResponse } from './interfaces';
import { ResponseParams } from './types';

@Injectable({ scope: Scope.REQUEST })
export class ResponseService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  private getLangFromRequest(): string {
    const headerKeys = ['x-language', 'accept-language', 'content-language'];

    for (const key of headerKeys) {
      const headerValue = this.request.headers[key.toLowerCase()];

      if (!headerValue) {
        continue;
      }

      if (Array.isArray(headerValue)) {
        if (headerValue.length > 0) {
          return headerValue[0];
        }
      } else if (typeof headerValue === 'string' && headerValue.trim()) {
        if (key === 'accept-language') {
          const langs = headerValue.split(',').map((l) => l.trim());
          if (langs.length) {
            return langs[0];
          }
        } else {
          return headerValue.trim();
        }
      }
    }

    return 'en';
  }

  private buildResponse<T extends object = any>(
    success: boolean,
    status: keyof typeof HTTP_STATUS,
    message: string,
    rest?: T,
  ): AppResponse<T> {
    const { method, path: reqPath } = this.request;
    const statusCode = HTTP_STATUS[status]?.status || (success ? 200 : 500);
    const statusText = HTTP_STATUS[status]?.context || (success ? 'HTTP_SUCCESS' : 'HTTP_ERROR');

    const response: AppResponse<T> = {
      method,
      success,
      status: statusText,
      statusCode,
      path: reqPath,
      timestamp: new Date().toISOString(),
      message,
    };

    if (rest && typeof rest === 'object' && Object.keys(rest).length > 0 && !Array.isArray(rest)) {
      response.data = { ...rest };
    }

    return response;
  }

  async success<T extends object = any>(
    status: keyof typeof HTTP_STATUS,
    params: ResponseParams,
  ): Promise<AppResponse<T>> {
    const { module, key, message: directMessage, args, ...rest } = params;

    let message: string;

    if (directMessage) {
      message = directMessage;
    } else {
      const msgKey = `${module}.success.${key}`;
      message = await this.i18n.translate(msgKey, {
        lang: this.getLangFromRequest(),
        args,
      });
    }

    return this.buildResponse<T>(true, status, message, rest as T);
  }

  async error<T extends object = any>(
    status: keyof typeof HTTP_STATUS,
    params: ResponseParams,
  ): Promise<AppResponse<T>> {
    const { module, key, message: directMessage, args, ...rest } = params;

    let message: string;
    if (directMessage) {
      message = directMessage;
    } else {
      const msgKey = `${module}.error.${key}`;

      message = await this.i18n.translate(msgKey, {
        lang: this.getLangFromRequest(),
        args,
      });
    }

    return this.buildResponse<T>(false, status, message, rest as T);
  }
}
