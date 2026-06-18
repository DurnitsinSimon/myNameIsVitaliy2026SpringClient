import { api } from './client';
import type { CreateUserPayload, ManagedUser, UpdateUserPayload } from '@/types';

export const usersApi = {
  list: () => api.get<ManagedUser[]>('/users').then((r) => r.data),

  create: (payload: CreateUserPayload) =>
    api.post<ManagedUser>('/users', payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserPayload) =>
    api.patch<ManagedUser>(`/users/${id}`, payload).then((r) => r.data),
};
