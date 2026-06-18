import { api } from './client';
import type { Category, CategoryPayload } from '@/types';

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),

  create: (payload: CategoryPayload) =>
    api.post<Category>('/categories', payload).then((r) => r.data),

  remove: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};
