import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { ROLE_PERMISSIONS, STATUS_LABELS } from '../types';
import {
  TabMain,
  TabDescription,
  TabCharacteristics,
  TabMedia,
  TabTeam,
  TabSEO,
  TabPublication,
  TabExport,
} from './TabContent';

const TABS = [
  { label: '📋 Основное', component: TabMain },
  { label: '📝 Описание', component: TabDescription },
  { label: '📐 Характеристики', component: TabCharacteristics },
  { label: '🖼 Медиа', component: TabMedia },
  { label: '👥 Команда', component: TabTeam },
  { label: '🔍 SEO', component: TabSEO },
  { label: '🚀 Публикация', component: TabPublication },
  { label: '💾 Выгрузка', component: TabExport },
];

export const ObjectEditor: React.FC = () => {
  const {
    currentObject: obj,
    editingId,
    isDirty,
    lastSaved,
    activeTab,
    setActiveTab,
    setView,
    saveDraft,
    saveObject,
    user,
  } = useStore();

  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const perms = ROLE_PERMISSIONS[user.role];

  // Autosave every 30 seconds when dirty
  useEffect(() => {
    if (!perms.canEdit) return;
    autosaveRef.current = setInterval(() => {
      if (useStore.getState().isDirty && useStore.getState().currentObject) {
        useStore.getState().saveDraft();
      }
    }, 30000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [perms.canEdit]);

  if (!obj) return null;

  const ActiveComponent = TABS[activeTab].component;

  const handleSave = () => {
    if (obj) saveObject(obj);
  };

  const handleBack = () => {
    if (isDirty && !window.confirm('Есть несохранённые изменения. Выйти?')) return;
    setView('list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F7F8FA' }}>
      {/* Top bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 60,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={handleBack} style={styles.backBtn}>← Список</button>

        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1D23' }}>
            {editingId ? obj.name || 'Без названия' : '+ Новый объект'}
          </span>
          {editingId && (
            <span style={{
              marginLeft: 12,
              background: '#F3F4F6',
              color: '#6B7280',
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 999,
            }}>
              {STATUS_LABELS[obj.status]}
            </span>
          )}
        </div>

        {/* Autosave indicator */}
        <div style={{ fontSize: 12, color: isDirty ? '#F59E0B' : '#10B981' }}>
          {isDirty ? '● Не сохранено' : lastSaved ? `✓ Сохранено ${lastSaved.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : ''}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setView('preview')} style={styles.btnSecondary}>
            👁 Предпросмотр
          </button>
          {perms.canEdit && (
            <>
              <button onClick={saveDraft} style={styles.btnSecondary}>
                Черновик
              </button>
              <button onClick={handleSave} style={styles.btnPrimary}>
                💾 Сохранить
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar tabs */}
        <div style={{
          width: 200,
          background: '#fff',
          borderRight: '1px solid #E5E7EB',
          padding: '20px 0',
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                ...styles.tabBtn,
                background: activeTab === i ? '#EFF6FF' : 'transparent',
                color: activeTab === i ? '#1C4ED8' : '#4B5563',
                borderRight: activeTab === i ? '3px solid #1C4ED8' : '3px solid transparent',
                fontWeight: activeTab === i ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <div style={{ maxWidth: 760 }}>
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: 14,
    padding: '4px 8px',
    borderRadius: 6,
    fontWeight: 500,
  },
  btnPrimary: {
    background: '#1C4ED8',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    background: '#F3F4F6',
    color: '#374151',
    border: '1px solid #E5E7EB',
    borderRadius: 7,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  tabBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.1s',
    fontFamily: 'inherit',
  },
};
