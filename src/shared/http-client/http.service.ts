import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpResponse } from './interfaces';

/**
 * Service to handle HTTP requests with retry and error handling logic.
 */
@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {
    // Adding interceptors to the axios instance
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Ensure headers are correctly initialized (use AxiosHeaders)
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        return config;
      },
      (error) => {
        // Ensure error is an instance of Error for proper Promise rejection
        return Promise.reject(error instanceof Error ? error : new Error('Unknown error'));
      },
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        // Modify or log incoming responses here
        return response;
      },
      (error: AxiosError) => {
        // Handle and log error responses here
        return Promise.reject(error instanceof Error ? error : new Error('Unknown error'));
      },
    );
  }

  // Type guard to check for AxiosError
  private isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  // Standardized error handling
  private handleRequest<T>(request: Observable<AxiosResponse<T>>): Observable<HttpResponse<T>> {
    return request.pipe(
      // Retry logic for transient errors (e.g., network failures)
      retry({
        count: 3,
        delay: 1000,
      }),
      map((response: AxiosResponse<T>) => {
        // Handle successful response
        return {
          data: response.data,
          status: response.status,
          success: response.status >= 200 && response.status < 300,
          message: response.statusText || 'OK',
          headers: response.headers,
        };
      }),
      catchError((error: unknown) => {
        let statusCode = 0;
        let message = 'Unknown error';
        let errorMessage = '';

        if (this.isAxiosError(error)) {
          if (error.response) {
            statusCode = error.response.status;
            message = error.response.statusText || 'HTTP error';
            errorMessage = error.message;
          } else if (error.request) {
            statusCode = 0;
            message = 'No response received';
            errorMessage = error.message;
          } else if (error.code === 'ENOTFOUND') {
            statusCode = -1;
            message = 'DNS lookup failed';
            errorMessage = error.message;
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = (error as Error).message || 'Unknown error';
        }

        return of({
          data: null,
          status: statusCode,
          success: false,
          message,
          error: errorMessage,
        });
      }),
    );
  }

  /**
   * Sends a DELETE request.
   * @param url - The URL to send the request to.
   * @param config - Optional request configuration.
   * @returns Observable of the standardized HTTP response.
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<HttpResponse<T>> {
    return this.handleRequest(this.httpService.delete<T>(url, config));
  }

  // GET request
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<HttpResponse<T>> {
    return this.handleRequest(this.httpService.get<T>(url, config));
  }

  // POST request
  post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<HttpResponse<T>> {
    return this.handleRequest(this.httpService.post<T>(url, data, config));
  }

  // PUT request
  put<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<HttpResponse<T>> {
    return this.handleRequest(this.httpService.put<T>(url, data, config));
  }
}
