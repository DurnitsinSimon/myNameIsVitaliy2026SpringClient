import { useNavigate } from 'react-router-dom';
import {
  App,
  Alert,
  Button,
  Card,
  Descriptions,
  List,
  Select,
  Space,
  Typography,
} from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CloudUploadOutlined,
  EyeOutlined,
  GlobalOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { ObjectStatusTag, WpStatusTag } from './StatusTag';
import { useUpdateObjectStatus } from '@/hooks/useObjects';
import { usePublishObject, useUnpublishObject } from '@/hooks/useWordpress';
import { usePermissions } from '@/hooks/usePermissions';
import { getPublishChecklist, isReadyToPublish } from '@/utils/validation';
import { OBJECT_STATUS_LABELS, OBJECT_STATUSES } from '@/constants';
import { extractErrorMessage } from '@/api/client';
import type { ObjectStatus, RealtyObject } from '@/types';

export function PublicationPanel({ object }: { object: RealtyObject }) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { canEdit } = usePermissions();
  const updateStatus = useUpdateObjectStatus(object.id);
  const publish = usePublishObject(object.id);
  const unpublish = useUnpublishObject(object.id);

  const checklist = getPublishChecklist(object);
  const ready = isReadyToPublish(object);

  const handleStatus = async (status: ObjectStatus) => {
    try {
      await updateStatus.mutateAsync(status);
      message.success('Статус обновлён');
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  const handlePublish = async () => {
    try {
      await publish.mutateAsync();
      message.success('Объект опубликован на сайте');
    } catch (e) {
      message.error(extractErrorMessage(e, 'Ошибка публикации'));
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublish.mutateAsync();
      message.success('Объект снят с публикации');
    } catch (e) {
      message.error(extractErrorMessage(e));
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 720 }}>
      <Card title="Статус и публикация" size="small">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Статус объекта">
            <Space>
              <ObjectStatusTag status={object.status} />
              {canEdit && (
                <Select<ObjectStatus>
                  size="small"
                  value={object.status}
                  style={{ width: 200 }}
                  loading={updateStatus.isPending}
                  onChange={handleStatus}
                  options={OBJECT_STATUSES.map((s) => ({
                    value: s,
                    label: OBJECT_STATUS_LABELS[s],
                  }))}
                />
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Публикация WordPress">
            <WpStatusTag status={object.wpPublishStatus} />
          </Descriptions.Item>
          {object.wpPostUrl && (
            <Descriptions.Item label="Адрес на сайте">
              <a href={object.wpPostUrl} target="_blank" rel="noreferrer">
                {object.wpPostUrl}
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Space style={{ marginTop: 12 }} wrap>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/objects/${object.id}/preview`)}>
            Предпросмотр
          </Button>
          {canEdit && (
            <>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={publish.isPending}
                disabled={!ready}
                onClick={handlePublish}
              >
                Опубликовать на сайте
              </Button>
              {object.wpPostId && (
                <Button
                  danger
                  icon={<StopOutlined />}
                  loading={unpublish.isPending}
                  onClick={handleUnpublish}
                >
                  Снять с публикации
                </Button>
              )}
            </>
          )}
        </Space>
      </Card>

      <Card
        size="small"
        title={
          <Space>
            <GlobalOutlined />
            Готовность к публикации
          </Space>
        }
      >
        {ready ? (
          <Alert type="success" showIcon message="Все обязательные поля заполнены" />
        ) : (
          <Alert
            type="warning"
            showIcon
            message="Не все обязательные поля заполнены"
            description="Опубликовать объект можно только после заполнения отмеченных пунктов."
          />
        )}
        <List
          size="small"
          dataSource={checklist}
          style={{ marginTop: 8 }}
          renderItem={(item) => (
            <List.Item>
              <Space>
                {item.ok ? (
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                ) : (
                  <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                )}
                <Typography.Text type={item.ok ? undefined : 'secondary'}>
                  {item.label}
                </Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
