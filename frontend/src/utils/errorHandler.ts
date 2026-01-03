import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.detail || error.message || 'An error occurred',
      status: error.response?.status,
      details: error.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
  };
}

export function formatError(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

