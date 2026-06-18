import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { useAuthStore } from '@/store/auth.store';
import { useMe } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface Props {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  const { data: user, isLoading, isError } = useMe();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="Нет доступа"
        subTitle="У вас недостаточно прав для просмотра этого раздела."
      />
    );
  }

  return <>{children}</>;
}
