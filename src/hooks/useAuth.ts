import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { queryKeys } from './queryKeys';

/** Текущий пользователь (загружается при наличии токена). */
export function useMe() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setToken(data.access_token);
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setToken(data.access_token);
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  return () => {
    logout();
    qc.clear();
  };
}
