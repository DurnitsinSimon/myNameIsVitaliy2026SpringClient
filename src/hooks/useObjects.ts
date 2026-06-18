import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { objectsApi } from '@/api/objects.api';
import type {
  ObjectFormValues,
  ObjectQuery,
  ObjectStatus,
  TeamMemberItem,
  TechSpecItem,
} from '@/types';
import { queryKeys } from './queryKeys';

export function useObjects(query: ObjectQuery) {
  return useQuery({
    queryKey: queryKeys.objects(query),
    queryFn: () => objectsApi.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useObject(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.object(id ?? ''),
    queryFn: () => objectsApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateObject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObjectFormValues) => objectsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['objects'] }),
  });
}

export function useUpdateObject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ObjectFormValues>) =>
      objectsApi.update(id, payload),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.object(id), data);
      qc.invalidateQueries({ queryKey: ['objects'] });
    },
  });
}

export function useUpdateObjectStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: ObjectStatus) => objectsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.object(id) });
      qc.invalidateQueries({ queryKey: ['objects'] });
    },
  });
}

export function useDeleteObject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => objectsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['objects'] }),
  });
}

export function useSetObjectCategories(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryIds: string[]) =>
      objectsApi.setCategories(id, categoryIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.object(id) }),
  });
}

export function useSetObjectTechSpecs(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: TechSpecItem[]) => objectsApi.setTechSpecs(id, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.object(id) }),
  });
}

export function useSetObjectTeam(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: TeamMemberItem[]) => objectsApi.setTeam(id, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.object(id) }),
  });
}
