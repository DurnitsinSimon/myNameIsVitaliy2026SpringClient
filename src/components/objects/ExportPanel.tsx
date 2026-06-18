import { useMemo, useState } from 'react';
import {
  App,
  Button,
  Card,
  Checkbox,
  Empty,
  Image,
  Radio,
  Space,
  Typography,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportApi } from '@/api/export.api';
import { useObject } from '@/hooks/useObjects';
import { EXPORT_FORMAT_LABELS } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { ExportFormat } from '@/types';

const BLOCKS = [
  { key: 'cover', label: 'Обложка объекта' },
  { key: 'description', label: 'Описание объекта' },
  { key: 'specs', label: 'Основные характеристики и ТЭП' },
  { key: 'gallery', label: 'Блок изображений' },
  { key: 'role', label: 'Роль компании' },
  { key: 'team', label: 'Команда проекта' },
];

export function ExportPanel({ objectId }: { objectId: string }) {
  const { message } = App.useApp();
  const { data: object } = useObject(objectId);
  const [format, setFormat] = useState<ExportFormat>('pptx');
  const [blocks, setBlocks] = useState<string[]>(BLOCKS.map((b) => b.key));
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const photos = useMemo(
    () => object?.media?.filter((m) => m.type !== 'MAIN_IMAGE') ?? [],
    [object],
  );

  const handleDownload = async () => {
    setLoading(true);
    try {
      await exportApi.download(objectId, format);
      message.success('Файл сформирован и скачан');
    } catch (e) {
      message.error(extractErrorMessage(e, 'Ошибка генерации файла'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 760 }}>
      <Card size="small" title="Формат файла">
        <Radio.Group
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          {(Object.keys(EXPORT_FORMAT_LABELS) as ExportFormat[]).map((f) => (
            <Radio.Button key={f} value={f}>
              {EXPORT_FORMAT_LABELS[f]}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      <Card size="small" title="Включаемые блоки">
        <Checkbox.Group
          value={blocks}
          onChange={(v) => setBlocks(v as string[])}
          options={BLOCKS.map((b) => ({ value: b.key, label: b.label }))}
        />
      </Card>

      <Card size="small" title="Выбор фотографий">
        {photos.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Нет дополнительных изображений"
          />
        ) : (
          <Checkbox.Group
            value={selectedPhotos}
            onChange={(v) => setSelectedPhotos(v as string[])}
            style={{ width: '100%' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12,
              }}
            >
              {photos.map((p) => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <Checkbox
                    value={p.id}
                    style={{ position: 'absolute', top: 6, left: 6, zIndex: 1 }}
                  />
                  <Image
                    src={p.url}
                    height={100}
                    width="100%"
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                    preview={false}
                  />
                </div>
              ))}
            </div>
          </Checkbox.Group>
        )}
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Для презентации рекомендуется выбрать 3–5 ключевых изображений.
        </Typography.Text>
      </Card>

      <Button
        type="primary"
        size="large"
        icon={<DownloadOutlined />}
        loading={loading}
        onClick={handleDownload}
      >
        Сгенерировать и скачать
      </Button>
    </Space>
  );
}
