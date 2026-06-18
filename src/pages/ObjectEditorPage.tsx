import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  App,
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  Tabs,
} from 'antd';
import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/AppLayout';
import { ObjectStatusTag } from '@/components/objects/StatusTag';
import { DictionarySelect } from '@/components/common/DictionarySelect';
import { CategoriesField } from '@/components/objects/CategoriesField';
import { TechSpecsEditor } from '@/components/objects/TechSpecsEditor';
import { TeamEditor } from '@/components/objects/TeamEditor';
import { MediaManager } from '@/components/objects/MediaManager';
import { PublicationPanel } from '@/components/objects/PublicationPanel';
import { ExportPanel } from '@/components/objects/ExportPanel';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateObject, useObject, useUpdateObject } from '@/hooks/useObjects';
import { queryKeys } from '@/hooks/queryKeys';
import { usePermissions } from '@/hooks/usePermissions';
import { objectsApi } from '@/api/objects.api';
import { extractErrorMessage } from '@/api/client';
import type {
  ObjectFormValues,
  TeamMemberItem,
  TechSpecItem,
} from '@/types';

const { TextArea } = Input;

export function ObjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { canEdit } = usePermissions();
  const [form] = Form.useForm<ObjectFormValues>();

  const queryClient = useQueryClient();
  const { data: object, isLoading } = useObject(id);
  const create = useCreateObject();
  const update = useUpdateObject(id ?? '');
  const [submitting, setSubmitting] = useState(false);

  // Связи редактируются отдельными эндпоинтами — держим их в локальном состоянии.
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [techSpecs, setTechSpecsState] = useState<TechSpecItem[]>([]);
  const [team, setTeamState] = useState<TeamMemberItem[]>([]);

  useEffect(() => {
    if (object) {
      form.setFieldsValue(object as unknown as ObjectFormValues);
      setCategoryIds(object.categories?.map((c) => c.categoryId) ?? []);
      setTechSpecsState(
        object.techSpecs?.map((t) => ({
          label: t.label,
          value: t.value,
          unit: t.unit ?? undefined,
          sortOrder: t.sortOrder,
        })) ?? [],
      );
      setTeamState(
        object.teamMembers?.map((t) => ({
          role: t.role,
          name: t.name,
          sortOrder: t.sortOrder,
        })) ?? [],
      );
    }
  }, [object, form]);

  const saving = submitting || create.isPending || update.isPending;
  const readOnly = !canEdit;

  // Связи (категории, ТЭП, команда) заменяются отдельными эндпоинтами.
  const persistRelations = async (objectId: string) => {
    const cleanSpecs = techSpecs.filter((s) => s.label.trim() && s.value.trim());
    const cleanTeam = team.filter((t) => t.role.trim() && t.name.trim());
    await objectsApi.setCategories(objectId, categoryIds);
    await objectsApi.setTechSpecs(objectId, cleanSpecs);
    await objectsApi.setTeam(objectId, cleanTeam);
  };

  const handleSave = async () => {
    let values: ObjectFormValues;
    try {
      values = await form.validateFields();
    } catch {
      message.warning('Проверьте обязательные поля');
      return;
    }

    setSubmitting(true);
    try {
      if (isNew) {
        const created = await create.mutateAsync(values);
        await persistRelations(created.id);
        message.success('Объект создан');
        navigate(`/objects/${created.id}`, { replace: true });
      } else {
        await update.mutateAsync(values);
        await persistRelations(id!);
        await queryClient.invalidateQueries({ queryKey: queryKeys.object(id!) });
        message.success('Изменения сохранены');
      }
    } catch (e) {
      message.error(extractErrorMessage(e, 'Не удалось сохранить'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const mainTab = (
    <Form form={form} layout="vertical" disabled={readOnly} style={{ maxWidth: 900 }}>
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="title"
            label="Название объекта"
            rules={[{ required: true, message: 'Укажите название' }, { max: 255 }]}
          >
            <Input placeholder="ЖК «Название»" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="shortTitle" label="Краткое название">
            <Input placeholder="Для списков и презентаций" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="city" label="Город" rules={[{ required: true, message: 'Укажите город' }]}>
            <DictionarySelect type="CITY" placeholder="Выберите город" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item name="address" label="Адрес">
            <Input placeholder="ул. Ленинградская, 14" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="objectType" label="Тип объекта">
            <DictionarySelect type="OBJECT_TYPE" placeholder="Тип" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="projectStatus" label="Статус проекта">
            <DictionarySelect type="PROJECT_STATUS" placeholder="Статус" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="designStage" label="Стадия проектирования">
            <DictionarySelect type="DESIGN_STAGE" placeholder="Стадия" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="inpadRole" label="Роль ИнПАД">
            <DictionarySelect type="INPAD_ROLE" placeholder="Роль компании" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="client" label="Заказчик">
            <Input placeholder="Наименование заказчика" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="designYear" label="Год проектирования">
            <Input placeholder="2023" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="realizationYear" label="Год реализации">
            <Input placeholder="2025" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Категории объекта">
        <CategoriesField value={categoryIds} onChange={setCategoryIds} disabled={readOnly} />
      </Form.Item>
    </Form>
  );

  const descriptionTab = (
    <Form form={form} layout="vertical" disabled={readOnly} style={{ maxWidth: 900 }}>
      <Form.Item
        name="shortDescription"
        label="Краткое описание"
        tooltip="Короткий текст для карточек, анонсов и презентаций"
        rules={[
          { required: true, message: 'Укажите краткое описание' },
          { min: 10, message: 'Минимум 10 символов' },
        ]}
      >
        <TextArea rows={3} showCount maxLength={500} />
      </Form.Item>
      <Form.Item name="fullDescription" label="Полное описание">
        <TextArea rows={10} placeholder="Основной текст страницы объекта" />
      </Form.Item>
    </Form>
  );

  const specsTab = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Form form={form} layout="vertical" disabled={readOnly} style={{ maxWidth: 700 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="area" label="Площадь объекта, м²">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="siteArea" label="Площадь участка, м²">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="floors" label="Этажность">
              <Input placeholder="напр. 12–25" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <TechSpecsEditor value={techSpecs} onChange={setTechSpecsState} disabled={readOnly} />
    </Space>
  );

  const seoTab = (
    <Form form={form} layout="vertical" disabled={readOnly} style={{ maxWidth: 760 }}>
      <Form.Item
        name="seoTitle"
        label="SEO-заголовок"
        rules={[{ max: 60, message: 'Максимум 60 символов' }]}
      >
        <Input showCount maxLength={60} />
      </Form.Item>
      <Form.Item
        name="seoDescription"
        label="Meta description"
        rules={[{ max: 160, message: 'Максимум 160 символов' }]}
      >
        <TextArea rows={3} showCount maxLength={160} />
      </Form.Item>
      <Form.Item name="seoSlug" label="ЧПУ-адрес (slug)">
        <Input addonBefore="/objects/" placeholder="zhk-nazvanie" />
      </Form.Item>
    </Form>
  );

  const items = [
    { key: 'main', label: 'Основное', children: mainTab },
    { key: 'description', label: 'Описание', children: descriptionTab },
    { key: 'specs', label: 'Характеристики', children: specsTab },
    {
      key: 'media',
      label: 'Медиа',
      children: isNew ? (
        <Empty description="Сначала сохраните объект, затем добавьте изображения" />
      ) : (
        <MediaManager objectId={id!} />
      ),
    },
    {
      key: 'team',
      label: 'Команда',
      children: <TeamEditor value={team} onChange={setTeamState} disabled={readOnly} />,
    },
    { key: 'seo', label: 'SEO', children: seoTab },
    {
      key: 'publication',
      label: 'Публикация',
      children:
        isNew || !object ? (
          <Empty description="Доступно после сохранения объекта" />
        ) : (
          <PublicationPanel object={object} />
        ),
    },
    {
      key: 'export',
      label: 'Выгрузка',
      children: isNew ? (
        <Empty description="Доступно после сохранения объекта" />
      ) : (
        <ExportPanel objectId={id!} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={isNew ? 'Новый объект' : object?.title ?? 'Объект'}
        subtitle={
          object
            ? `${object.city} · обновлён ${new Date(object.updatedAt).toLocaleDateString('ru')}`
            : 'Заполните карточку по шаблону'
        }
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/objects')}>
              К списку
            </Button>
            {object && (
              <>
                <ObjectStatusTag status={object.status} />
                <Button icon={<EyeOutlined />} onClick={() => navigate(`/objects/${object.id}/preview`)}>
                  Предпросмотр
                </Button>
              </>
            )}
            {canEdit && (
              <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
                Сохранить
              </Button>
            )}
          </Space>
        }
      />
      <div style={{ padding: 28 }}>
        <Tabs items={items} />
      </div>
    </>
  );
}
