import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  BankOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  PictureOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { usePermissions } from '@/hooks/usePermissions';
import { UserFooter } from './UserFooter';

const { Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = usePermissions();

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/objects')) return '/objects';
    if (path.startsWith('/media')) return '/media';
    if (path.startsWith('/export')) return '/export';
    if (path.startsWith('/dictionaries')) return '/dictionaries';
    if (path.startsWith('/users')) return '/users';
    if (path.startsWith('/audit')) return '/audit';
    return path;
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={248}
        theme="light"
        style={{
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div className="inpad-brand">
          <span className="inpad-brand__logo">
            <BankOutlined />
          </span>
          <span className="inpad-brand__title">ИнПАД</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="inpad-section-label">Контент</div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', padding: '0 8px' }}
            items={[
              {
                key: '/objects',
                icon: <UnorderedListOutlined />,
                label: 'Объекты',
              },
              { key: '/media', icon: <PictureOutlined />, label: 'Медиатека' },
              { key: '/export', icon: <DownloadOutlined />, label: 'Выгрузка' },
            ]}
          />

          <div className="inpad-section-label">Администрирование</div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', padding: '0 8px' }}
            items={[
              {
                key: '/dictionaries',
                icon: <DatabaseOutlined />,
                label: 'Справочники',
                disabled: !isAdmin,
              },
              {
                key: '/users',
                icon: <TeamOutlined />,
                label: 'Пользователи',
                disabled: !isAdmin,
              },
              {
                key: '/audit',
                icon: <HistoryOutlined />,
                label: 'Журнал действий',
                disabled: !isAdmin,
              },
            ]}
          />
        </div>

        <UserFooter />
      </Sider>

      <Layout>
        <Content style={{ padding: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

// Заголовок страницы, переиспользуется во всех разделах.
export function PageHeader({
  title,
  subtitle,
  extra,
}: {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        padding: '20px 28px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div>
        <Typography.Title level={4} style={{ margin: 0, color: '#1e293b' }}>
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {extra}
    </div>
  );
}
