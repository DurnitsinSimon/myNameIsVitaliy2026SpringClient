import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wordpressApi } from '@/api/wordpress.api';
import { queryKeys } from './queryKeys';

export function useWordpressCheck(enabled = true) {
  return useQuery({
    queryKey: queryKeys.wordpressCheck,
    queryFn: () => wordpressApi.check(),
    enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function usePublishObject(objectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => wordpressApi.publish(objectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.object(objectId) });
      qc.invalidateQueries({ queryKey: ['objects'] });
    },
  });
}

export function useUnpublishObject(objectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => wordpressApi.unpublish(objectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.object(objectId) });
      qc.invalidateQueries({ queryKey: ['objects'] });
    },
  });
}
