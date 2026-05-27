const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  createdAt: string;
}

// Работа с токеном
export const setToken = (token: string) => localStorage.setItem('access_token', token);
export const getToken = (): string | null => localStorage.getItem('access_token');
export const removeToken = () => localStorage.removeItem('access_token');

// Вспомогательная функция для запросов с авторизацией
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401) {
    removeToken();
    throw new Error('Сессия истекла');
  }
  return response;
}

// Логин
export const login = async (email: string, password: string): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка входа');
  }
  const data: AuthResponse = await response.json();
  setToken(data.access_token);
  return getMe();
};

// Регистрация
export const register = async (email: string, password: string, name: string): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка регистрации');
  }
  const data: AuthResponse = await response.json();
  setToken(data.access_token);
  return getMe();
};

// Получение текущего пользователя (GET /auth/me)
export const getMe = async (): Promise<UserInfo> => {
  const response = await fetchWithAuth('/auth/me');
  if (!response.ok) {
    throw new Error('Не удалось получить данные пользователя');
  }
  return response.json();
};

// Проверка авторизации (валидность токена)
export const checkAuth = async (): Promise<UserInfo | null> => {
  const token = getToken();
  if (!token) return null;
  try {
    return await getMe();
  } catch {
    removeToken();
    return null;
  }
};