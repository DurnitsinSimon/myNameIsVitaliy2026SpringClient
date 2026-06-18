import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '@/api/media.api';
import type { UploadMediaPayload } from '@/types';
import { queryKeys } from './queryKeys';

export function useObjectMedia(objectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.media(objectId ?? ''),
    queryFn: () => mediaApi.listByObject(objectId as string),
    enabled: !!objectId,
  });
}

export function useUploadMedia(objectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadMediaPayload) => mediaApi.upload(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.media(objectId) });
      qc.invalidateQueries({ queryKey: queryKeys.object(objectId) });
    },
  });
}

export function useDeleteMedia(objectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mediaApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.media(objectId) });
      qc.invalidateQueries({ queryKey: queryKeys.object(objectId) });
    },
  });
}
