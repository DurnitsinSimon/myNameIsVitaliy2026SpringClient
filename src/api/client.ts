import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

// Подставляем JWT в каждый запрос.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Глобальная обработка 401 — разлогиниваем.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { token, logout } = useAuthStore.getState();
      if (token) logout();
    }
    return Promise.reject(error);
  },
);

interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
}

/** Извлекает понятное пользователю сообщение из ответа бэкенда. */
export function extractErrorMessage(error: unknown, fallback = 'Произошла ошибка'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
