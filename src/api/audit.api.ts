import { api } from './client';
import type { AuditLog, Paginated } from '@/types';

export const auditApi = {
  list: (page = 1, limit = 50) =>
    api
      .get<Paginated<AuditLog>>('/audit', { params: { page, limit } })
      .then((r) => r.data),

  byObject: (objectId: string) =>
    api.get<AuditLog[]>(`/audit/object/${objectId}`).then((r) => r.data),
};
