import { useState } from 'react';
import { Empty, Select, Space } from 'antd';
import { PageHeader } from '@/components/layout/AppLayout';
import { MediaManager } from '@/components/objects/MediaManager';
import { useObjects } from '@/hooks/useObjects';
import { useObjectMedia } from '@/hooks/useMedia';

export function MediaPage() {
  const [objectId, setObjectId] = useState<string | undefined>();
  const { data: list } = useObjects({ limit: 100 });
  const { data: media } = useObjectMedia(objectId);

  return (
    <>
      <PageHeader
        title="Медиатека"
        subtitle={
          objectId
            ? `Загружено: ${media?.length ?? 0} файлов`
            : 'Изображения и материалы объектов'
        }
        extra={
          <Select
            showSearch
            placeholder="Выберите объект"
            style={{ width: 320 }}
            value={objectId}
            onChange={setObjectId}
            optionFilterProp="label"
            options={(list?.items ?? []).map((o) => ({
              value: o.id,
              label: o.title,
            }))}
          />
        }
      />
      <div style={{ padding: 28 }}>
        {objectId ? (
          <MediaManager objectId={objectId} />
        ) : (
          <Space style={{ width: '100%', justifyContent: 'center', marginTop: 60 }}>
            <Empty description="Выберите объект, чтобы управлять его медиафайлами" />
          </Space>
        )}
      </div>
    </>
  );
}
