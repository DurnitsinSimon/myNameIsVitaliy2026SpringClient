import type { DictionaryType, ObjectQuery } from '@/types';

export const queryKeys = {
  me: ['auth', 'me'] as const,
  objects: (query: ObjectQuery) => ['objects', query] as const,
  object: (id: string) => ['objects', id] as const,
  media: (objectId: string) => ['media', objectId] as const,
  dictionaries: (type?: DictionaryType) => ['dictionaries', type ?? 'all'] as const,
  audit: (page: number, limit: number) => ['audit', page, limit] as const,
  auditByObject: (objectId: string) => ['audit', 'object', objectId] as const,
  wordpressCheck: ['wordpress', 'check'] as const,
  categories: ['categories'] as const,
  users: ['users'] as const,
};
