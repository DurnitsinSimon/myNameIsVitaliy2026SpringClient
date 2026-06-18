import { useAuthStore } from '@/store/auth.store';

/** Хелперы для проверки прав текущего пользователя по роли. */
export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'ADMIN',
    isEditor: role === 'EDITOR',
    isViewer: role === 'VIEWER',
    canEdit: role === 'ADMIN' || role === 'EDITOR',
    canManageDictionaries: role === 'ADMIN',
    canViewAudit: role === 'ADMIN',
  };
}
