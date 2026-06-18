import { Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/constants';

export function UserFooter() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ borderTop: '1px solid #e2e8f0', padding: '14px 20px' }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Пользователь:
      </Typography.Text>
      <div style={{ fontWeight: 600, color: '#1e293b' }}>
        {user?.name ?? '—'}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
        Роль: {user ? ROLE_LABELS[user.role] : '—'}
      </div>
      <Button
        type="text"
        size="small"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ paddingLeft: 0, color: '#1e3a5f' }}
      >
        Выйти
      </Button>
    </div>
  );
}
