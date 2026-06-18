import type {
  DictionaryType,
  MediaType,
  ObjectStatus,
  UserRole,
  WpPublishStatus,
} from './types';

export const OBJECT_STATUS_LABELS: Record<ObjectStatus, string> = {
  DRAFT: 'Черновик',
  ON_REVIEW: 'На проверке',
  NEEDS_REVISION: 'Требует доработки',
  PUBLISHED: 'Опубликован',
  ARCHIVED: 'Архив',
  PUBLISH_ERROR: 'Ошибка публикации',
};

export const OBJECT_STATUS_COLORS: Record<ObjectStatus, string> = {
  DRAFT: 'default',
  ON_REVIEW: 'processing',
  NEEDS_REVISION: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'default',
  PUBLISH_ERROR: 'error',
};

export const WP_STATUS_LABELS: Record<WpPublishStatus, string> = {
  NOT_PUBLISHED: 'Не опубликовано',
  WP_DRAFT: 'Черновик WordPress',
  PUBLISHED: 'Опубликовано',
  UPDATED: 'Обновлено',
  UNPUBLISHED: 'Снято с публикации',
  PUBLISH_ERROR: 'Ошибка публикации',
};

export const WP_STATUS_COLORS: Record<WpPublishStatus, string> = {
  NOT_PUBLISHED: 'default',
  WP_DRAFT: 'default',
  PUBLISHED: 'success',
  UPDATED: 'cyan',
  UNPUBLISHED: 'warning',
  PUBLISH_ERROR: 'error',
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  MAIN_IMAGE: 'Главное изображение',
  GALLERY: 'Галерея',
  PLAN: 'План / схема',
  RENDER: 'Рендер / визуализация',
  PHOTO: 'Фотография',
  PRESENTATION_COVER: 'Обложка презентации',
  PORTFOLIO: 'Портфолио',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Администратор',
  EDITOR: 'Редактор',
  VIEWER: 'Просмотр',
};

export const DICTIONARY_TYPE_LABELS: Record<DictionaryType, string> = {
  OBJECT_TYPE: 'Типы объектов',
  CITY: 'Города',
  DESIGN_STAGE: 'Стадии проектирования',
  PROJECT_STATUS: 'Статусы проекта',
  INPAD_ROLE: 'Роли ИнПАД',
};

export const OBJECT_STATUSES = Object.keys(OBJECT_STATUS_LABELS) as ObjectStatus[];
export const MEDIA_TYPES = Object.keys(MEDIA_TYPE_LABELS) as MediaType[];
export const DICTIONARY_TYPES = Object.keys(DICTIONARY_TYPE_LABELS) as DictionaryType[];

export const EXPORT_FORMAT_LABELS = {
  pptx: 'Презентация (PPTX)',
  docx: 'Портфолио (DOCX)',
  pdf: 'PDF-документ',
} as const;
