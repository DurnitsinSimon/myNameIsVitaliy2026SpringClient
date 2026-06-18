import { useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tabs,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/AppLayout';
import {
  useCreateDictionary,
  useDeleteDictionary,
  useDictionaries,
  useUpdateDictionary,
} from '@/hooks/useDictionaries';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { DICTIONARY_TYPE_LABELS, DICTIONARY_TYPES } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { Category, Dictionary, DictionaryType } from '@/types';

function DictionaryTable({ type }: { type: DictionaryType }) {
  const { message, modal } = App.useApp();
  const { data, isLoading } = useDictionaries(type);
  const create = useCreateDictionary();
  const update = useUpdateDictionary();
  const remove = useDeleteDictionary();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Dictionary | null>(null);
  const [form] = Form.useForm<{ name: string; sortOrder?: number }>();

  const openModal = (item?: Dictionary) => {
    setEditing(item ?? null);
    form.setFieldsValue({ name: item?.name ?? '', sortOrder: item?.sortOrder ?? 0 });
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload: values });
        message.success('Значение обновлено');
      } else {
        await create.mutateAsync({ type, ...values });
        message.success('Значение добавлено');
      }
      setOpen(false);
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  const handleDelete = (item: Dictionary) => {
    modal.confirm({
      title: `Удалить «${item.name}»?`,
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await remove.mutateAsync(item.id);
          message.success('Удалено');
        } catch (e) {
          message.error(extractErrorMessage(e));
        }
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Добавить значение
      </Button>
      <Table<Dictionary>
        rowKey="id"
        size="small"
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={[
          { title: 'Порядок', dataIndex: 'sortOrder', width: 100 },
          { title: 'Значение', dataIndex: 'name' },
          {
            title: 'Активно',
            dataIndex: 'isActive',
            width: 120,
            render: (v: boolean) =>
              v ? <Tag color="success">Да</Tag> : <Tag>Нет</Tag>,
          },
          {
            title: '',
            key: 'actions',
            width: 100,
            align: 'right',
            render: (_, r) => (
              <Space size={0}>
                <Button type="text" icon={<EditOutlined />} onClick={() => openModal(r)} />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(r)}
                />
              </Space>
            ),
          },
        ]}
        style={{ background: '#fff', borderRadius: 8, maxWidth: 720 }}
      />

      <Modal
        title={editing ? 'Изменить значение' : 'Новое значение'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={create.isPending || update.isPending}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Значение" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sortOrder" label="Порядок сортировки">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function CategoriesTable() {
  const { message, modal } = App.useApp();
  const { data, isLoading } = useCategories();
  const create = useCreateCategory();
  const remove = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<{ name: string; slug?: string }>();

  const submit = async () => {
    const values = await form.validateFields();
    try {
      await create.mutateAsync(values);
      message.success('Категория добавлена');
      setOpen(false);
      form.resetFields();
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  const handleDelete = (item: Category) => {
    modal.confirm({
      title: `Удалить категорию «${item.name}»?`,
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await remove.mutateAsync(item.id);
          message.success('Удалено');
        } catch (e) {
          message.error(extractErrorMessage(e));
        }
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => setOpen(true)}
      >
        Добавить категорию
      </Button>
      <Table<Category>
        rowKey="id"
        size="small"
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={[
          { title: 'Название', dataIndex: 'name' },
          {
            title: 'Slug',
            dataIndex: 'slug',
            render: (v: string) => <Tag>{v}</Tag>,
          },
          {
            title: '',
            width: 60,
            align: 'right',
            render: (_, r) => (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(r)}
              />
            ),
          },
        ]}
        style={{ background: '#fff', borderRadius: 8, maxWidth: 720 }}
      />
      <Modal
        title="Новая категория"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={create.isPending}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug (необязательно)" tooltip="Если пусто — сгенерируется автоматически">
            <Input placeholder="zhilye-kompleksy" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export function DictionariesPage() {
  return (
    <>
      <PageHeader title="Справочники" subtitle="Управление классификаторами системы" />
      <div style={{ padding: 28 }}>
        <Tabs
          tabPosition="left"
          items={[
            { key: 'CATEGORY', label: 'Категории объектов', children: <CategoriesTable /> },
            ...DICTIONARY_TYPES.map((t) => ({
              key: t,
              label: DICTIONARY_TYPE_LABELS[t],
              children: <DictionaryTable type={t} />,
            })),
          ]}
        />
      </div>
    </>
  );
}
