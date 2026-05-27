// src/store/useStore.ts

import { create } from 'zustand';
import { ObjectCard, User, ListFilters, ObjectStatus } from '../types';
import { MOCK_OBJECTS, createEmptyObject } from '../utils/mockData';
import * as authApi from '../api/auth';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  // Objects list
  objects: ObjectCard[];
  filters: ListFilters;

  // Current editing object
  currentObject: ObjectCard | null;
  editingId: string | null;
  isDirty: boolean;
  lastSaved: Date | null;

  // UI state
  activeTab: number;
  view: 'list' | 'edit' | 'preview';

  // Notifications
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppActions {
  // Auth
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Navigation
  setView: (view: 'list' | 'edit' | 'preview') => void;
  setActiveTab: (tab: number) => void;

  // List filters
  setFilters: (filters: Partial<ListFilters>) => void;
  resetFilters: () => void;

  // Object CRUD
  openCreate: () => void;
  openEdit: (id: string) => void;
  saveObject: (obj: ObjectCard) => void;
  saveDraft: () => void;
  deleteObject: (id: string) => void;
  publishObject: () => void;

  // Current object editing
  updateCurrentObject: (patch: Partial<ObjectCard>) => void;

  // Notifications
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;

  // Export
  exportObject: (id: string, format: 'pptx' | 'docx') => void;
}

const DEFAULT_FILTERS: ListFilters = {
  search: '',
  status: '',
  objectType: '',
  city: '',
  published: 'all',
};

// Helper: преобразование роли из API в формат приложения
const mapRole = (apiRole: string): 'admin' | 'editor' | 'viewer' => {
  switch (apiRole.toUpperCase()) {
    case 'ADMIN': return 'admin';
    case 'EDITOR': return 'editor';
    default: return 'viewer';
  }
};

export const useStore = create<AppState & AppActions>((set, get) => ({
  // ==================== STATE ====================
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,

  objects: MOCK_OBJECTS,
  filters: DEFAULT_FILTERS,
  currentObject: null,
  editingId: null,
  isDirty: false,
  lastSaved: null,
  activeTab: 0,
  view: 'list',
  notifications: [],

  // ==================== AUTH ACTIONS ====================
  login: async (email: string, password: string) => {
    try {
      const userInfo = await authApi.login(email, password);
      const appUser: User = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: mapRole(userInfo.role),
      };
      set({ user: appUser, isAuthenticated: true });
      get().addNotification('success', `Добро пожаловать, ${appUser.name}`);
    } catch (error: any) {
      get().addNotification('error', error.message || 'Ошибка входа');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const userInfo = await authApi.register(email, password, name);
      const appUser: User = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: mapRole(userInfo.role),
      };
      set({ user: appUser, isAuthenticated: true });
      get().addNotification('success', `Добро пожаловать, ${appUser.name}`);
    } catch (error: any) {
      get().addNotification('error', error.message || 'Ошибка регистрации');
      throw error;
    }
  },

  logout: () => {
    authApi.removeToken();
    set({ user: null, isAuthenticated: false, currentObject: null, view: 'list' });
    get().addNotification('info', 'Вы вышли из системы');
  },

  checkAuth: async () => {
    try {
      const userInfo = await authApi.checkAuth();
      if (userInfo) {
        const appUser: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          role: mapRole(userInfo.role),
        };
        set({ user: appUser, isAuthenticated: true, isLoadingAuth: false });
      } else {
        set({ isLoadingAuth: false });
      }
    } catch {
      set({ isLoadingAuth: false });
    }
  },

  // ==================== NAVIGATION ====================
  setView: (view) => set({ view }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ==================== FILTERS ====================
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // ==================== CRUD (оставляем без изменений, работа с моками) ====================
  openCreate: () => {
    const obj = createEmptyObject();
    obj.id = `obj_${Date.now()}`;
    set({ currentObject: obj, editingId: null, isDirty: false, activeTab: 0, view: 'edit' });
  },

  openEdit: (id) => {
    const obj = get().objects.find((o) => o.id === id);
    if (obj) {
      set({
        currentObject: JSON.parse(JSON.stringify(obj)),
        editingId: id,
        isDirty: false,
        activeTab: 0,
        view: 'edit',
      });
    }
  },

  saveObject: (obj) => {
    const objects = get().objects;
    const idx = objects.findIndex((o) => o.id === obj.id);
    const updated = { ...obj, updatedAt: new Date().toISOString() };
    let newObjects: ObjectCard[];
    if (idx >= 0) {
      newObjects = objects.map((o) => (o.id === obj.id ? updated : o));
    } else {
      newObjects = [...objects, updated];
    }
    set({ objects: newObjects, currentObject: updated, isDirty: false, lastSaved: new Date() });
    get().addNotification('success', 'Объект сохранён');
  },

  saveDraft: () => {
    const obj = get().currentObject;
    if (!obj) return;
    get().saveObject({ ...obj, status: 'draft' });
    get().addNotification('info', 'Черновик сохранён');
  },

  deleteObject: (id) => {
    set((s) => ({ objects: s.objects.filter((o) => o.id !== id) }));
    get().addNotification('success', 'Объект удалён');
  },

  publishObject: () => {
    const obj = get().currentObject;
    if (!obj) return;

    const missing: string[] = [];
    if (!obj.name) missing.push('Название объекта');
    if (!obj.objectType) missing.push('Тип объекта');
    if (!obj.city) missing.push('Город');
    if (!obj.shortDescription) missing.push('Краткое описание');
    if (!obj.mainImage) missing.push('Главное изображение');
    if (!obj.projectStatus) missing.push('Статус проекта');
    if (!obj.inpadRole) missing.push('Роль ИНПАД');

    if (missing.length > 0) {
      get().addNotification('error', `Не заполнены обязательные поля: ${missing.join(', ')}`);
      return;
    }

    const updated: ObjectCard = {
      ...obj,
      status: 'review' as ObjectStatus,
      publicationStatus: 'pending',
    };
    get().saveObject(updated);
    get().addNotification('success', 'Объект отправлен на публикацию');
  },

  updateCurrentObject: (patch) => {
    set((s) => ({
      currentObject: s.currentObject ? { ...s.currentObject, ...patch } : null,
      isDirty: true,
    }));
  },

  // ==================== NOTIFICATIONS ====================
  addNotification: (type, message) => {
    const id = `n_${Date.now()}`;
    set((s) => ({
      notifications: [...s.notifications, { id, type, message }],
    }));
    setTimeout(() => get().removeNotification(id), 4000);
  },

  removeNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  },

  // ==================== EXPORT ====================
  exportObject: (id, format) => {
    get().addNotification('info', `Запрос на выгрузку ${format.toUpperCase()} отправлен...`);
    setTimeout(() => {
      get().addNotification('success', `Файл ${format.toUpperCase()} готов к скачиванию`);
    }, 1500);
  },
}));