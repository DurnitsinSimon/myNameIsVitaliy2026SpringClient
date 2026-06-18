import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dictionariesApi } from '@/api/dictionaries.api';
import type { DictionaryPayload, DictionaryType } from '@/types';
import { queryKeys } from './queryKeys';

export function useDictionaries(type?: DictionaryType) {
  return useQuery({
    queryKey: queryKeys.dictionaries(type),
    queryFn: () => dictionariesApi.list(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDictionary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DictionaryPayload) => dictionariesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dictionaries'] }),
  });
}

export function useUpdateDictionary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DictionaryPayload> }) =>
      dictionariesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dictionaries'] }),
  });
}

export function useDeleteDictionary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dictionariesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dictionaries'] }),
  });
}
