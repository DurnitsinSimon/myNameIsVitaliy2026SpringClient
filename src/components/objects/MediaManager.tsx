import { useState } from 'react';
import {
  App,
  Button,
  Card,
  Checkbox,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd';
import {
  DeleteOutlined,
  InboxOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useDeleteMedia, useObjectMedia, useUploadMedia } from '@/hooks/useMedia';
import { usePermissions } from '@/hooks/usePermissions';
import { MEDIA_TYPE_LABELS, MEDIA_TYPES } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { MediaType } from '@/types';

interface Props {
  objectId: string;
}

export function MediaManager({ objectId }: Props) {
  const { message, modal } = App.useApp();
  const { canEdit } = usePermissions();
  const { data: media, isLoading } = useObjectMedia(objectId);
  const upload = useUploadMedia(objectId);
  const remove = useDeleteMedia(objectId);

  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleUpload = async () => {
    const values = await form.validateFields();
    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.warning('Выберите файл');
      return;
    }
    try {
      await upload.mutateAsync({
        file: file as File,
        objectId,
        type: values.type,
        altText: values.altText,
        caption: values.caption,
        sortOrder: values.sortOrder ?? 0,
        useOnSite: values.useOnSite ?? true,
        useInPptx: values.useInPptx ?? false,
        useInPortfolio: values.useInPortfolio ?? false,
      });
      message.success('Файл загружен');
      setOpen(false);
      setFileList([]);
      form.resetFields();
    } catch (e) {
      message.error(extractErrorMessage(e, 'Не удалось загрузить файл'));
    }
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: 'Удалить изображение?',
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await remove.mutateAsync(id);
          message.success('Файл удалён');
        } catch (e) {
          message.error(extractErrorMessage(e));
        }
      },
    });
  };

  return (
    <>
      {canEdit && (
        <Button
          type="primary"
          icon={<PictureOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => setOpen(true)}
        >
          Загрузить изображение
        </Button>
      )}

      {!media?.length && !isLoading ? (
        <Empty description="Нет загруженных изображений" />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {media?.map((m) => (
            <Card
              key={m.id}
              size="small"
              cover={
                <Image
                  src={m.url}
                  alt={m.altText ?? m.filename}
                  height={150}
                  style={{ objectFit: 'cover' }}
                  fallback="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23eef1f5'/%3E%3C/svg%3E"
                />
              }
              actions={
                canEdit
                  ? [
                      <Tooltip title="Удалить" key="del">
                        <DeleteOutlined onClick={() => handleDelete(m.id)} />
                      </Tooltip>,
                    ]
                  : undefined
              }
            >
              <Card.Meta
                title={<Tag color="blue">{MEDIA_TYPE_LABELS[m.type]}</Tag>}
                description={
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <span style={{ fontSize: 12 }}>{m.caption ?? m.filename}</span>
                    <Space size={4} wrap>
                      {m.useOnSite && <Tag>сайт</Tag>}
                      {m.useInPptx && <Tag>презентация</Tag>}
                      {m.useInPortfolio && <Tag>портфолио</Tag>}
                    </Space>
                  </Space>
                }
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Загрузка изображения"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleUpload}
        confirmLoading={upload.isPending}
        okText="Загрузить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'GALLERY', useOnSite: true, sortOrder: 0 }}
        >
          <Form.Item label="Файл" required>
            <Upload.Dragger
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
              accept="image/jpeg,image/png,image/webp"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Перетащите файл или нажмите для выбора
              </p>
              <p className="ant-upload-hint">JPEG, PNG, WEBP — до 10 МБ</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
            <Select
              options={MEDIA_TYPES.map((t: MediaType) => ({
                value: t,
                label: MEDIA_TYPE_LABELS[t],
              }))}
            />
          </Form.Item>
          <Form.Item name="caption" label="Подпись">
            <Input placeholder="Подпись к изображению" />
          </Form.Item>
          <Form.Item name="altText" label="Alt-текст для сайта">
            <Input placeholder="Альтернативный текст" />
          </Form.Item>
          <Form.Item name="sortOrder" label="Порядок сортировки">
            <Input type="number" />
          </Form.Item>
          <Space size="large">
            <Form.Item name="useOnSite" valuePropName="checked" noStyle>
              <Checkbox>На сайте</Checkbox>
            </Form.Item>
            <Form.Item name="useInPptx" valuePropName="checked" noStyle>
              <Checkbox>В презентации</Checkbox>
            </Form.Item>
            <Form.Item name="useInPortfolio" valuePropName="checked" noStyle>
              <Checkbox>В портфолио</Checkbox>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
