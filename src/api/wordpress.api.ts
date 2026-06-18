import { api } from './client';
import type { RealtyObject, WordpressStatus } from '@/types';

export const wordpressApi = {
  check: () =>
    api.get<WordpressStatus>('/wordpress/check').then((r) => r.data),

  publish: (objectId: string) =>
    api.post<RealtyObject>(`/wordpress/publish/${objectId}`).then((r) => r.data),

  unpublish: (objectId: string) =>
    api
      .post<RealtyObject>(`/wordpress/unpublish/${objectId}`)
      .then((r) => r.data),
};
