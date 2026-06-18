import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/api/audit.api';
import { queryKeys } from './queryKeys';

export function useAudit(page = 1, limit = 50) {
  return useQuery({
    queryKey: queryKeys.audit(page, limit),
    queryFn: () => auditApi.list(page, limit),
    placeholderData: (prev) => prev,
  });
}
