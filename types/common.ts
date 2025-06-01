// types/common.ts
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>; // optional: for validation errors
}