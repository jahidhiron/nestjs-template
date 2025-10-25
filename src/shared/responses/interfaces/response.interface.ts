export interface AppResponse<T extends object = any> {
  method: string;
  path: string;
  timestamp: string;
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  data?: T | null;
}
