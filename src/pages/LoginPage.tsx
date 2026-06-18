import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Segmented, Typography, App } from 'antd';
import {
  BankOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth.store';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/api/client';

type Mode = 'login' | 'register';

export function LoginPage() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const [mode, setMode] = useState<Mode>('login');

  const login = useLogin();
  const register = useRegister();

  if (token) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/objects';
    return <Navigate to={from} replace />;
  }

  const loading = login.isPending || register.isPending;

  const onFinish = async (values: {
    email: string;
    password: string;
    name?: string;
  }) => {
    try {
      if (mode === 'login') {
        await login.mutateAsync({
          email: values.email,
          password: values.password,
        });
      } else {
        await register.mutateAsync({
          email: values.email,
          password: values.password,
          name: values.name!,
        });
      }
      message.success('Добро пожаловать!');
      navigate('/objects', { replace: true });
    } catch (e) {
      message.error(extractErrorMessage(e, 'Не удалось войти'));
    }
  };

  return (
    <div className="inpad-login-bg">
      <div className="inpad-login-card-wrap">
        <div style={{ width: '100%', maxWidth: 420, padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span className="inpad-brand__logo" style={{ margin: '0 auto', width: 56, height: 56, fontSize: 30 }}>
              <BankOutlined />
            </span>
            <Typography.Title level={2} style={{ margin: '14px 0 2px', color: '#1e293b' }}>
              ИнПАД
            </Typography.Title>
            <Typography.Text type="secondary">
              Система управления объектами
            </Typography.Text>
          </div>

          <Card variant="borderless" styles={{ body: { padding: 28 } }}>
            <Segmented<Mode>
              block
              value={mode}
              onChange={(v) => setMode(v)}
              options={[
                { label: 'Вход', value: 'login' },
                { label: 'Регистрация', value: 'register' },
              ]}
              style={{ marginBottom: 20 }}
            />

            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              {mode === 'register' && (
                <Form.Item
                  name="name"
                  label="Имя"
                  rules={[
                    { required: true, message: 'Введите имя' },
                    { min: 2, message: 'Минимум 2 символа' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Алексей Петров" size="large" />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label="Электронная почта"
                rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email', message: 'Некорректный email' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="mail@inpad.ru" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••" size="large" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                {mode === 'login' ? 'Войти в систему' : 'Зарегистрироваться'}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
