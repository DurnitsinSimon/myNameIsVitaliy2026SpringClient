import { api } from './client';
import type { Dictionary, DictionaryPayload, DictionaryType } from '@/types';

export const dictionariesApi = {
  list: (type?: DictionaryType) =>
    api
      .get<Dictionary[]>('/dictionaries', { params: type ? { type } : undefined })
      .then((r) => r.data),

  create: (payload: DictionaryPayload) =>
    api.post<Dictionary>('/dictionaries', payload).then((r) => r.data),

  update: (id: string, payload: Partial<DictionaryPayload>) =>
    api.patch<Dictionary>(`/dictionaries/${id}`, payload).then((r) => r.data),

  remove: (id: string) => api.delete(`/dictionaries/${id}`).then((r) => r.data),
};
