import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/layout/AppLayout';
import { ObjectStatusTag, WpStatusTag } from '@/components/objects/StatusTag';
import { useDeleteObject, useObjects } from '@/hooks/useObjects';
import { useDictionaries } from '@/hooks/useDictionaries';
import { usePermissions } from '@/hooks/usePermissions';
import { OBJECT_STATUS_LABELS, OBJECT_STATUSES } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { ObjectStatus, RealtyObject } from '@/types';

export function ObjectsPage() {
  const navigate = useNavigate();
  const { modal, message } = App.useApp();
  const { canEdit } = usePermissions();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ObjectStatus | undefined>();
  const [objectType, setObjectType] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isFetching } = useObjects({
    search: search || undefined,
    status,
    objectType,
    page,
    limit,
  });
  const { data: types } = useDictionaries('OBJECT_TYPE');
  const deleteObject = useDeleteObject();

  const handleDelete = (obj: RealtyObject) => {
    modal.confirm({
      title: 'Удалить объект?',
      content: `«${obj.title}» будет удалён без возможности восстановления.`,
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteObject.mutateAsync(obj.id);
          message.success('Объект удалён');
        } catch (e) {
          message.error(extractErrorMessage(e));
        }
      },
    });
  };

  const columns: ColumnsType<RealtyObject> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 110,
        render: (id: string) => (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {id.slice(0, 8)}
          </Typography.Text>
        ),
      },
      {
        title: 'Название',
        dataIndex: 'title',
        render: (_, r) => (
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.title}</div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {r.address ?? r.shortTitle ?? '—'}
            </Typography.Text>
          </div>
        ),
      },
      { title: 'Тип', dataIndex: 'objectType', render: (v) => v ?? '—' },
      { title: 'Город', dataIndex: 'city' },
      {
        title: 'Статус',
        dataIndex: 'status',
        width: 150,
        render: (s: ObjectStatus, r) => (
          <Space direction="vertical" size={2}>
            <ObjectStatusTag status={s} />
            <WpStatusTag status={r.wpPublishStatus} />
          </Space>
        ),
      },
      {
        title: 'Обновлён',
        dataIndex: 'updatedAt',
        width: 120,
        render: (v: string) => dayjs(v).format('DD.MM.YYYY'),
      },
      {
        title: '',
        key: 'actions',
        width: 64,
        align: 'right',
        render: (_, r) => (
          <Space size={0}>
            <Tooltip title="Предпросмотр">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/objects/${r.id}/preview`);
                }}
              />
            </Tooltip>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'edit',
                    icon: <EditOutlined />,
                    label: 'Редактировать',
                    onClick: () => navigate(`/objects/${r.id}`),
                  },
                  {
                    key: 'export',
                    icon: <DownloadOutlined />,
                    label: 'Выгрузка',
                    onClick: () => navigate(`/objects/${r.id}/export`),
                  },
                  ...(r.wpPostUrl
                    ? [
                        {
                          key: 'site',
                          icon: <GlobalOutlined />,
                          label: 'Открыть на сайте',
                          onClick: () => window.open(r.wpPostUrl!, '_blank'),
                        },
                      ]
                    : []),
                  ...(canEdit
                    ? [
                        { type: 'divider' as const },
                        {
                          key: 'delete',
                          icon: <DeleteOutlined />,
                          label: 'Удалить',
                          danger: true,
                          onClick: () => handleDelete(r),
                        },
                      ]
                    : []),
                ],
              }}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canEdit, navigate],
  );

  return (
    <>
      <PageHeader
        title="Объекты недвижимости"
        subtitle={
          data ? `${data.items.length} из ${data.total} объектов` : 'Загрузка…'
        }
        extra={
          canEdit && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/objects/new')}
            >
              Создать объект
            </Button>
          )
        }
      />

      <div style={{ padding: 28 }}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Поиск по названию или городу"
            style={{ width: 320 }}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            onChange={(e) => !e.target.value && setSearch('')}
          />
          <Select
            allowClear
            placeholder="Все статусы"
            style={{ width: 190 }}
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={OBJECT_STATUSES.map((s) => ({
              value: s,
              label: OBJECT_STATUS_LABELS[s],
            }))}
          />
          <Select
            allowClear
            placeholder="Все типы"
            style={{ width: 190 }}
            value={objectType}
            onChange={(v) => {
              setObjectType(v);
              setPage(1);
            }}
            options={(types ?? []).map((t) => ({ value: t.name, label: t.name }))}
          />
        </Space>

        <Table<RealtyObject>
          rowKey="id"
          columns={columns}
          dataSource={data?.items}
          loading={isLoading || isFetching}
          onRow={(r) => ({
            onClick: () => navigate(`/objects/${r.id}`),
            style: { cursor: 'pointer' },
          })}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.total ?? 0,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
            },
          }}
          style={{ background: '#fff', borderRadius: 8 }}
        />
      </div>
    </>
  );
}
