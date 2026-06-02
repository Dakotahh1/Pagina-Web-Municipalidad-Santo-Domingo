export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: { total: number; page?: number; limit?: number };
  error?: { code: string; message: string; details?: unknown };
}
