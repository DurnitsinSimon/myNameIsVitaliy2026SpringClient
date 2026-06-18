// Доменные типы, согласованные с Prisma-схемой бэкенда ИнПАД.

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export type ObjectStatus =
  | 'DRAFT'
  | 'ON_REVIEW'
  | 'NEEDS_REVISION'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'PUBLISH_ERROR';

export type WpPublishStatus =
  | 'NOT_PUBLISHED'
  | 'WP_DRAFT'
  | 'PUBLISHED'
  | 'UPDATED'
  | 'UNPUBLISHED'
  | 'PUBLISH_ERROR';

export type MediaType =
  | 'MAIN_IMAGE'
  | 'GALLERY'
  | 'PLAN'
  | 'RENDER'
  | 'PHOTO'
  | 'PRESENTATION_COVER'
  | 'PORTFOLIO';

export type DictionaryType =
  | 'OBJECT_TYPE'
  | 'CITY'
  | 'DESIGN_STAGE'
  | 'PROJECT_STATUS'
  | 'INPAD_ROLE';

export type ExportFormat = 'pptx' | 'docx' | 'pdf';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface Media {
  id: string;
  objectId: string;
  type: MediaType;
  filename: string;
  url: string;
  altText?: string | null;
  caption?: string | null;
  sortOrder: number;
  useOnSite: boolean;
  useInPptx: boolean;
  useInPortfolio: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ObjectCategory {
  objectId: string;
  categoryId: string;
  category: Category;
}

export interface TeamMember {
  id: string;
  objectId: string;
  role: string;
  name: string;
  sortOrder: number;
}

export interface TechSpec {
  id: string;
  objectId: string;
  label: string;
  value: string;
  unit?: string | null;
  sortOrder: number;
}

export interface ObjectAuthor {
  id: string;
  name: string;
  email: string;
}

export interface RealtyObject {
  id: string;
  title: string;
  shortTitle?: string | null;
  city: string;
  address?: string | null;
  designYear?: string | null;
  realizationYear?: string | null;
  projectStatus?: string | null;
  objectType?: string | null;
  client?: string | null;
  inpadRole?: string | null;
  designStage?: string | null;
  area?: number | null;
  siteArea?: number | null;
  floors?: string | null;
  shortDescription: string;
  fullDescription?: string | null;

  status: ObjectStatus;
  wpPublishStatus: WpPublishStatus;
  wpPostId?: number | null;
  wpPostUrl?: string | null;

  seoTitle?: string | null;
  seoDescription?: string | null;
  seoSlug?: string | null;
  seoImage?: string | null;

  authorId: string;
  author?: ObjectAuthor;
  createdAt: string;
  updatedAt: string;

  media?: Media[];
  categories?: ObjectCategory[];
  teamMembers?: TeamMember[];
  techSpecs?: TechSpec[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Dictionary {
  id: string;
  type: DictionaryType;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details?: Record<string, unknown> | null;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  objectId?: string | null;
  createdAt: string;
}

export interface WordpressStatus {
  connected: boolean;
  user?: string;
}

// --- DTO для запросов ---

export interface ObjectFormValues {
  title: string;
  shortTitle?: string;
  city: string;
  address?: string;
  designYear?: string;
  realizationYear?: string;
  projectStatus?: string;
  objectType?: string;
  client?: string;
  inpadRole?: string;
  designStage?: string;
  area?: number;
  siteArea?: number;
  floors?: string;
  shortDescription: string;
  fullDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
}

export interface ObjectQuery {
  search?: string;
  status?: ObjectStatus;
  city?: string;
  objectType?: string;
  authorId?: string;
  designYear?: string;
  page?: number;
  limit?: number;
}

export interface UploadMediaPayload {
  file: File;
  objectId: string;
  type: MediaType;
  altText?: string;
  caption?: string;
  sortOrder?: number;
  useOnSite?: boolean;
  useInPptx?: boolean;
  useInPortfolio?: boolean;
}

export interface DictionaryPayload {
  type: DictionaryType;
  name: string;
  sortOrder?: number;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
}

export interface TechSpecItem {
  label: string;
  value: string;
  unit?: string;
  sortOrder?: number;
}

export interface TeamMemberItem {
  role: string;
  name: string;
  sortOrder?: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ManagedUser extends User {
  isActive: boolean;
}
