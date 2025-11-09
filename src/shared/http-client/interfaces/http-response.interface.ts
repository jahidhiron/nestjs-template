export interface HttpResponse<T = any> {
  data: T | null;
  status: number;
  success: boolean;
  message?: string;
  error?: string;
  headers?: Record<string, any>;
}
