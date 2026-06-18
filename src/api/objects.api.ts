import { api } from './client';
import type {
  ObjectFormValues,
  ObjectQuery,
  ObjectStatus,
  Paginated,
  RealtyObject,
  TeamMemberItem,
  TechSpecItem,
} from '@/types';

function buildParams(query: ObjectQuery): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  });
  return params;
}

export const objectsApi = {
  list: (query: ObjectQuery = {}) =>
    api
      .get<Paginated<RealtyObject>>('/objects', { params: buildParams(query) })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<RealtyObject>(`/objects/${id}`).then((r) => r.data),

  create: (payload: ObjectFormValues) =>
    api.post<RealtyObject>('/objects', payload).then((r) => r.data),

  update: (id: string, payload: Partial<ObjectFormValues>) =>
    api.patch<RealtyObject>(`/objects/${id}`, payload).then((r) => r.data),

  updateStatus: (id: string, status: ObjectStatus) =>
    api
      .patch<RealtyObject>(`/objects/${id}/status`, { status })
      .then((r) => r.data),

  remove: (id: string) => api.delete(`/objects/${id}`).then((r) => r.data),

  setCategories: (id: string, categoryIds: string[]) =>
    api
      .patch<RealtyObject>(`/objects/${id}/categories`, { categoryIds })
      .then((r) => r.data),

  setTechSpecs: (id: string, items: TechSpecItem[]) =>
    api
      .patch<RealtyObject>(`/objects/${id}/tech-specs`, { items })
      .then((r) => r.data),

  setTeam: (id: string, items: TeamMemberItem[]) =>
    api.patch<RealtyObject>(`/objects/${id}/team`, { items }).then((r) => r.data),
};
