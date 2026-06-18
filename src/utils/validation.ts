import type { RealtyObject } from '@/types';

export interface ChecklistItem {
  key: string;
  label: string;
  ok: boolean;
}

/**
 * Проверка готовности объекта к публикации (см. ТЗ §13.1).
 * Бэкенд выполняет финальную проверку, здесь — подсказка пользователю.
 */
export function getPublishChecklist(obj: RealtyObject): ChecklistItem[] {
  const hasMainImage = !!obj.media?.some((m) => m.type === 'MAIN_IMAGE');
  const hasCategory = !!obj.categories && obj.categories.length > 0;

  return [
    { key: 'title', label: 'Название объекта', ok: !!obj.title?.trim() },
    { key: 'objectType', label: 'Тип объекта', ok: !!obj.objectType },
    { key: 'city', label: 'Город', ok: !!obj.city?.trim() },
    {
      key: 'shortDescription',
      label: 'Краткое описание (от 10 символов)',
      ok: !!obj.shortDescription && obj.shortDescription.trim().length >= 10,
    },
    { key: 'mainImage', label: 'Главное изображение', ok: hasMainImage },
    { key: 'category', label: 'Категория объекта', ok: hasCategory },
    { key: 'projectStatus', label: 'Статус проекта', ok: !!obj.projectStatus },
    { key: 'inpadRole', label: 'Роль компании ИнПАД', ok: !!obj.inpadRole },
    { key: 'seoTitle', label: 'SEO-заголовок', ok: !!obj.seoTitle },
    { key: 'seoDescription', label: 'SEO-описание', ok: !!obj.seoDescription },
  ];
}

export function isReadyToPublish(obj: RealtyObject): boolean {
  return getPublishChecklist(obj).every((i) => i.ok);
}
