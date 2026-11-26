import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '../../config/env';
import { ApiError } from './ApiError';
import { parseErrorBody } from './parseErrorBody';

export interface ApiClientConfig {
  getAccessToken?: () => string | null | undefined;
  onUnauthorized?: (error: ApiError) => void;
}

const clientConfig: ApiClientConfig = {};

export function configureApiClient(patch: Partial<ApiClientConfig>) {
  Object.assign(clientConfig, patch);
}

// 1. Используем свободное имя `skipAuth` вместо занятого `auth`
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** true — не подставлять токен и не редиректить на логин при 401 (для каталога, входа, регистрации) */
    skipAuth?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = clientConfig.getAccessToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(
        new ApiError({
          kind: 'network',
          message: 'Неизвестная ошибка при выполнении запроса',
          originalError: error,
        })
      );
    }

    const axiosError = error as AxiosError;

    if (axios.isCancel(axiosError) || axiosError.code === 'ERR_CANCELED') {
      return Promise.reject(
        new ApiError({
          kind: 'aborted',
          message: 'Запрос отменён',
          originalError: axiosError,
        })
      );
    }

    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      return Promise.reject(
        new ApiError({
          kind: 'timeout',
          message: 'Сервер долго не отвечает. Попробуйте позже',
          originalError: axiosError,
        })
      );
    }

    if (!axiosError.response) {
      return Promise.reject(
        new ApiError({
          kind: 'network',
          message: 'Нет соединения с сервером',
          originalError: axiosError,
        })
      );
    }

    const { status, statusText, data, headers } = axiosError.response;
    const parsed = parseErrorBody(data);

    const apiError = new ApiError({
      kind: 'http',
      status,
      message: parsed.message ?? (statusText || `Ошибка HTTP ${status}`),
      code: parsed.code,
      fieldErrors: parsed.fieldErrors,
      traceId: parsed.traceId ?? (headers?.['x-request-id'] as string | undefined),
      data,
      originalError: axiosError,
    });

    
    if (status === 401 && !axiosError.config?.skipAuth) {
      clientConfig.onUnauthorized?.(apiError);
    }

    return Promise.reject(apiError);
  }
);
