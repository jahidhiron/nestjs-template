export interface HttpProxyResponse<T = unknown> {
  data: T | null;
  status: number;
  success: boolean;
  message: string;
  error?: string;
}
