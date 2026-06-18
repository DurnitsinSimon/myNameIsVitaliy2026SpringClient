import { useState } from 'react';
import {
  App,
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/AppLayout';
import { useCreateUser, useUpdateUser, useUsers } from '@/hooks/useUsers';
import { useWordpressCheck } from '@/hooks/useWordpress';
import { useAuthStore } from '@/store/auth.store';
import { ROLE_LABELS } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { ManagedUser, UserRole } from '@/types';

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as UserRole[]).map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}));

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'red',
  EDITOR: 'blue',
  VIEWER: 'default',
};

export function UsersPage() {
  const { message } = App.useApp();
  const me = useAuthStore((s) => s.user);
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const wp = useWordpressCheck();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const submitCreate = async () => {
    const values = await createForm.validateFields();
    try {
      await createUser.mutateAsync(values);
      message.success('Пользователь создан');
      setCreateOpen(false);
      createForm.resetFields();
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  const openEdit = (user: ManagedUser) => {
    setEditing(user);
    editForm.setFieldsValue({
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const submitEdit = async () => {
    if (!editing) return;
    const values = await editForm.validateFields();
    try {
      await updateUser.mutateAsync({ id: editing.id, payload: values });
      message.success('Пользователь обновлён');
      setEditing(null);
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  return (
    <>
      <PageHeader
        title="Пользователи"
        subtitle="Управление доступами и подключениями"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Добавить пользователя
          </Button>
        }
      />
      <div style={{ padding: 28 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card size="small" styles={{ body: { padding: 0 } }}>
            <Table<ManagedUser>
              rowKey="id"
              loading={isLoading}
              dataSource={users}
              pagination={false}
              columns={[
                {
                  title: 'Имя',
                  dataIndex: 'name',
                  render: (v, r) => (
                    <Space>
                      {v}
                      {r.id === me?.id && <Tag color="green">это вы</Tag>}
                    </Space>
                  ),
                },
                { title: 'Email', dataIndex: 'email' },
                {
                  title: 'Роль',
                  dataIndex: 'role',
                  width: 160,
                  render: (r: UserRole) => <Tag color={ROLE_COLORS[r]}>{ROLE_LABELS[r]}</Tag>,
                },
                {
                  title: 'Статус',
                  dataIndex: 'isActive',
                  width: 130,
                  render: (a: boolean) =>
                    a ? <Tag color="success">Активен</Tag> : <Tag>Отключён</Tag>,
                },
                {
                  title: 'Создан',
                  dataIndex: 'createdAt',
                  width: 120,
                  render: (v: string) => dayjs(v).format('DD.MM.YYYY'),
                },
                {
                  title: '',
                  width: 60,
                  align: 'right',
                  render: (_, r) => (
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                  ),
                },
              ]}
            />
          </Card>

          <Card title="Подключение к WordPress" size="small" style={{ maxWidth: 520 }}>
            {wp.isLoading ? (
              <Alert type="info" message="Проверка соединения…" />
            ) : wp.data?.connected ? (
              <Alert
                type="success"
                showIcon
                message={`Соединение установлено${wp.data.user ? ` (${wp.data.user})` : ''}`}
              />
            ) : (
              <Alert type="error" showIcon message="Нет соединения с WordPress" />
            )}
          </Card>
        </Space>
      </div>

      <Modal
        title="Новый пользователь"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        confirmLoading={createUser.isPending}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={createForm} layout="vertical" initialValues={{ role: 'EDITOR' }}>
          <Form.Item name="name" label="Имя" rules={[{ required: true, min: 2 }]}>
            <Input placeholder="Иван Иванов" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="user@inpad.ru" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Минимум 6 символов" />
          </Form.Item>
          <Form.Item name="role" label="Роль">
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Редактирование: ${editing?.name ?? ''}`}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={submitEdit}
        confirmLoading={updateUser.isPending}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Имя" rules={[{ required: true, min: 2 }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Роль"
            tooltip={editing?.id === me?.id ? 'Нельзя изменить собственную роль' : undefined}
          >
            <Select options={ROLE_OPTIONS} disabled={editing?.id === me?.id} />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Активен"
            valuePropName="checked"
            tooltip={editing?.id === me?.id ? 'Нельзя деактивировать себя' : undefined}
          >
            <Switch disabled={editing?.id === me?.id} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
