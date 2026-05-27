// ==================== РОЛИ ====================
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ==================== ОБЪЕКТ ====================
export type ObjectStatus =
  | 'draft'
  | 'review'
  | 'revision'
  | 'published'
  | 'archived'
  | 'error';

export type PublicationStatus = 'unpublished' | 'published' | 'pending' | 'error';

export interface ImageItem {
  id: string;
  url: string;
  preview: string;
  caption: string;
  order: number;
  isMain: boolean;
  onSite: boolean;
  inPresentation: boolean;
  inPortfolio: boolean;
}

export interface TeamMember {
  role: string;
  name: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface ObjectCard {
  id: string;

  // Основное
  name: string;
  shortName: string;
  city: string;
  region: string;
  address: string;
  yearDesign: string;
  yearRealized: string;
  projectStatus: string;
  objectType: string;
  customer: string;
  inpadRole: string;
  designStage: string;
  areaObject: string;
  areaSite: string;
  floors: string;

  // Описание
  shortDescription: string;
  fullDescription: string;

  // Характеристики
  totalArea: string;
  buildingArea: string;
  floorsCount: string;
  buildingsCount: string;
  parkingSpaces: string;
  extraCharacteristics: KeyValue[];

  // Медиа
  mainImage: ImageItem | null;
  gallery: ImageItem[];

  // Команда
  team: TeamMember[];

  // SEO
  seoTitle: string;
  metaDescription: string;
  slug: string;
  ogImage: ImageItem | null;

  // Статус
  status: ObjectStatus;
  publicationStatus: PublicationStatus;
  updatedAt: string;
  createdAt: string;
}

// ==================== ФИЛЬТРЫ ====================
export interface ListFilters {
  search: string;
  status: ObjectStatus | '';
  objectType: string;
  city: string;
  published: 'all' | 'yes' | 'no';
}

// ==================== КОНСТАНТЫ ====================
export const OBJECT_TYPES = [
  'Жилой комплекс',
  'Общественное здание',
  'Офисное здание',
  'Торговый центр',
  'Промышленный объект',
  'Спортивный объект',
  'Гостиница',
  'Медицинское учреждение',
  'Образовательное учреждение',
  'Другое',
];

export const PROJECT_STATUSES = [
  'Концепция',
  'Проектирование',
  'Строительство',
  'Реализован',
  'Приостановлен',
  'Отменён',
];

export const INPAD_ROLES = [
  'Генеральный проектировщик',
  'Субподрядчик',
  'Авторский надзор',
  'Консультант',
  'Партнёр',
];

export const DESIGN_STAGES = [
  'Концепция',
  'Эскизный проект',
  'Проектная документация',
  'Рабочая документация',
  'Сдан',
];

export const STATUS_LABELS: Record<ObjectStatus, string> = {
  draft: 'Черновик',
  review: 'На проверке',
  revision: 'Требует доработки',
  published: 'Опубликован',
  archived: 'Архивный',
  error: 'Ошибка публикации',
};

export const STATUS_COLORS: Record<ObjectStatus, string> = {
  draft: '#8B93A1',
  review: '#F59E0B',
  revision: '#EF4444',
  published: '#10B981',
  archived: '#6B7280',
  error: '#DC2626',
};

// ==================== ПРАВА ДОСТУПА ====================
export const ROLE_PERMISSIONS: Record<UserRole, {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
  canExport: boolean;
  canViewAll: boolean;
}> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canExport: true,
    canViewAll: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canPublish: true,
    canExport: true,
    canViewAll: true,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canExport: true,
    canViewAll: true,
  },
};
