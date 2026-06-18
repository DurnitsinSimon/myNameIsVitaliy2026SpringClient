import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/AppLayout';
import { ObjectStatusTag } from '@/components/objects/StatusTag';
import { useObject } from '@/hooks/useObjects';

const { Title, Paragraph, Text } = Typography;

export function ObjectPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: object, isLoading } = useObject(id);

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!object) return <Empty description="Объект не найден" style={{ marginTop: 80 }} />;

  const main = object.media?.find((m) => m.type === 'MAIN_IMAGE');
  const gallery = object.media?.filter((m) => m.type === 'GALLERY' || m.type === 'PHOTO') ?? [];

  const specs: Array<[string, string | number | null | undefined]> = [
    ['Тип объекта', object.objectType],
    ['Город', object.city],
    ['Адрес', object.address],
    ['Год проектирования', object.designYear],
    ['Год реализации', object.realizationYear],
    ['Площадь объекта, м²', object.area],
    ['Площадь участка, м²', object.siteArea],
    ['Этажность', object.floors],
    ['Заказчик', object.client],
    ['Стадия проектирования', object.designStage],
  ];

  return (
    <>
      <PageHeader
        title="Предпросмотр страницы"
        subtitle="Так страница объекта будет выглядеть на сайте ИнПАД.ru"
        extra={
          <Space>
            <ObjectStatusTag status={object.status} />
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/objects')}>
              К списку
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/objects/${object.id}`)}>
              Редактировать
            </Button>
          </Space>
        }
      />
      <div style={{ padding: 28, display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: '100%', maxWidth: 960 }} styles={{ body: { padding: 32 } }}>
          {main ? (
            <Image
              src={main.url}
              alt={main.altText ?? object.title}
              width="100%"
              height={360}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          ) : (
            <div
              style={{
                height: 280,
                background: '#eef1f5',
                borderRadius: 8,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Text type="secondary">Главное изображение не загружено</Text>
            </div>
          )}

          <Space size={[8, 8]} wrap style={{ marginTop: 20 }}>
            {object.categories?.map((c) => (
              <Tag key={c.categoryId} color="blue">
                {c.category.name}
              </Tag>
            ))}
          </Space>

          <Title level={2} style={{ marginTop: 12 }}>
            {object.title}
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#475569' }}>
            {object.shortDescription}
          </Paragraph>

          <Divider orientation="left">Основные характеристики</Divider>
          <Descriptions column={2} size="small" bordered>
            {specs
              .filter(([, v]) => v !== null && v !== undefined && v !== '')
              .map(([label, value]) => (
                <Descriptions.Item key={label} label={label}>
                  {value}
                </Descriptions.Item>
              ))}
          </Descriptions>

          {gallery.length > 0 && (
            <>
              <Divider orientation="left">Галерея</Divider>
              <Image.PreviewGroup>
                <Row gutter={[12, 12]}>
                  {gallery.map((g) => (
                    <Col span={8} key={g.id}>
                      <Image
                        src={g.url}
                        height={160}
                        width="100%"
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </>
          )}

          {object.fullDescription && (
            <>
              <Divider orientation="left">Подробное описание</Divider>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {object.fullDescription}
              </Paragraph>
            </>
          )}

          {object.inpadRole && (
            <>
              <Divider orientation="left">Роль ИнПАД в проекте</Divider>
              <Paragraph>{object.inpadRole}</Paragraph>
            </>
          )}

          {object.teamMembers && object.teamMembers.length > 0 && (
            <>
              <Divider orientation="left">Команда проекта</Divider>
              <Row gutter={[12, 12]}>
                {object.teamMembers.map((t) => (
                  <Col span={12} key={t.id}>
                    <Text type="secondary">{t.role}: </Text>
                    <Text strong>{t.name}</Text>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
