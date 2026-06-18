import { useState } from 'react';
import { Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/layout/AppLayout';
import { useAudit } from '@/hooks/useAudit';
import type { AuditLog } from '@/types';

const ACTION_LABELS: Record<string, string> = {
  OBJECT_CREATED: 'Создание объекта',
  OBJECT_UPDATED: 'Редактирование объекта',
  OBJECT_DELETED: 'Удаление объекта',
  OBJECT_STATUS_CHANGED: 'Изменение статуса',
  MEDIA_UPLOADED: 'Загрузка файла',
  MEDIA_DELETED: 'Удаление файла',
  OBJECT_PUBLISHED: 'Публикация на сайте',
  OBJECT_UNPUBLISHED: 'Снятие с публикации',
  EXPORT_GENERATED: 'Выгрузка документа',
};

export function AuditPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { data, isLoading, isFetching } = useAudit(page, limit);

  return (
    <>
      <PageHeader title="Журнал действий" subtitle="История ключевых действий пользователей" />
      <div style={{ padding: 28 }}>
        <Table<AuditLog>
          rowKey="id"
          loading={isLoading || isFetching}
          dataSource={data?.items}
          columns={[
            {
              title: 'Дата и время',
              dataIndex: 'createdAt',
              width: 180,
              render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
            },
            {
              title: 'Действие',
              dataIndex: 'action',
              render: (a: string) => <Tag color="blue">{ACTION_LABELS[a] ?? a}</Tag>,
            },
            {
              title: 'Пользователь',
              dataIndex: ['user', 'name'],
              render: (_, r) => (
                <div>
                  <div>{r.user?.name ?? '—'}</div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {r.user?.email}
                  </Typography.Text>
                </div>
              ),
            },
            {
              title: 'Объект',
              dataIndex: 'objectId',
              render: (v: string | null) =>
                v ? (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {v.slice(0, 8)}
                  </Typography.Text>
                ) : (
                  '—'
                ),
            },
          ]}
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
