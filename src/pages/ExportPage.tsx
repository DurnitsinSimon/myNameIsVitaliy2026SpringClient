import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Empty, Select, Space } from 'antd';
import { PageHeader } from '@/components/layout/AppLayout';
import { ExportPanel } from '@/components/objects/ExportPanel';
import { useObject, useObjects } from '@/hooks/useObjects';

export function ExportPage() {
  const { id } = useParams<{ id: string }>();
  const [picked, setPicked] = useState<string | undefined>(id);
  const activeId = id ?? picked;

  const { data: list } = useObjects({ limit: 100 });
  const { data: object } = useObject(activeId);

  return (
    <>
      <PageHeader
        title="Выгрузка файлов"
        subtitle={object ? `${object.title} — ${object.city}` : 'Генерация документов из данных объекта'}
        extra={
          !id && (
            <Select
              showSearch
              placeholder="Выберите объект"
              style={{ width: 320 }}
              value={picked}
              onChange={setPicked}
              optionFilterProp="label"
              options={(list?.items ?? []).map((o) => ({
                value: o.id,
                label: o.title,
              }))}
            />
          )
        }
      />
      <div style={{ padding: 28 }}>
        {activeId ? (
          <ExportPanel objectId={activeId} />
        ) : (
          <Space style={{ width: '100%', justifyContent: 'center', marginTop: 60 }}>
            <Empty description="Выберите объект для выгрузки" />
          </Space>
        )}
      </div>
    </>
  );
}
