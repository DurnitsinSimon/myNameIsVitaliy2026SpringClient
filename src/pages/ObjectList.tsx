import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  ObjectStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  OBJECT_TYPES,
  ROLE_PERMISSIONS,
} from '../types';

const StatusBadge = ({ status }: { status: ObjectStatus }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#fff',
      background: STATUS_COLORS[status],
      letterSpacing: '0.02em',
    }}
  >
    {STATUS_LABELS[status]}
  </span>
);

const PublicationDot = ({ published }: { published: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: published ? '#10B981' : '#9CA3AF',
      marginRight: 6,
    }}
  />
);

export const ObjectList: React.FC = () => {
  const {
    objects,
    filters,
    setFilters,
    resetFilters,
    user,
    openCreate,
    openEdit,
    deleteObject,
    exportObject,
    setView,
    editingId,
  } = useStore();

  const perms = ROLE_PERMISSIONS[user.role];

  const cities = useMemo(() => {
    const s = new Set(objects.map((o) => o.city).filter(Boolean));
    return Array.from(s).sort();
  }, [objects]);

  const filtered = useMemo(() => {
    return objects.filter((o) => {
      if (filters.search && !o.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.objectType && o.objectType !== filters.objectType) return false;
      if (filters.city && o.city !== filters.city) return false;
      if (filters.published === 'yes' && o.publicationStatus !== 'published') return false;
      if (filters.published === 'no' && o.publicationStatus === 'published') return false;
      return true;
    });
  }, [objects, filters]);

  const handlePreview = (id: string) => {
    useStore.getState().openEdit(id);
    setView('preview');
  };

  return (
    <div style={{ padding: '32px 40px', minHeight: '100vh', background: '#F7F8FA' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1A1D23', fontFamily: 'Unbounded, sans-serif' }}>
            Объекты
          </h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>
            {filtered.length} из {objects.length} объектов
          </p>
        </div>
        {perms.canCreate && (
          <button onClick={openCreate} style={styles.btnPrimary}>
            + Создать объект
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="🔍  Поиск по названию..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          style={styles.input}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as ObjectStatus | '' })}
          style={styles.select}
        >
          <option value="">Все статусы</option>
          {(Object.keys(STATUS_LABELS) as ObjectStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={filters.objectType}
          onChange={(e) => setFilters({ objectType: e.target.value })}
          style={styles.select}
        >
          <option value="">Все типы</option>
          {OBJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ city: e.target.value })}
          style={styles.select}
        >
          <option value="">Все города</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.published}
          onChange={(e) => setFilters({ published: e.target.value as 'all' | 'yes' | 'no' })}
          style={styles.select}
        >
          <option value="all">Публикация: все</option>
          <option value="yes">Опубликованы</option>
          <option value="no">Не опубликованы</option>
        </select>
        {(filters.search || filters.status || filters.objectType || filters.city || filters.published !== 'all') && (
          <button onClick={resetFilters} style={styles.btnGhost}>✕ Сбросить</button>
        )}
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#F0F2F5' }}>
              {['Название', 'Город', 'Тип', 'Статус', 'Публикация', 'Изменён', 'Действия'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: 15 }}>
                  Объекты не найдены
                </td>
              </tr>
            )}
            {filtered.map((obj) => (
              <tr key={obj.id} style={styles.tr}>
                <td style={{ ...styles.td, fontWeight: 600, color: '#1A1D23', maxWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {obj.mainImage ? (
                      <img
                        src={obj.mainImage.preview}
                        alt=""
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: 6, background: '#E5E7EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#9CA3AF', fontSize: 18, flexShrink: 0,
                      }}>🏗</div>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {obj.name}
                    </span>
                  </div>
                </td>
                <td style={styles.td}>{obj.city || '—'}</td>
                <td style={styles.td}>{obj.objectType || '—'}</td>
                <td style={styles.td}><StatusBadge status={obj.status} /></td>
                <td style={styles.td}>
                  <PublicationDot published={obj.publicationStatus === 'published'} />
                  {obj.publicationStatus === 'published' ? 'На сайте' :
                    obj.publicationStatus === 'pending' ? 'Ожидает' : 'Не опубликован'}
                </td>
                <td style={{ ...styles.td, color: '#6B7280', fontSize: 13 }}>
                  {new Date(obj.updatedAt).toLocaleDateString('ru-RU')}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => handlePreview(obj.id)} style={styles.btnIcon} title="Предпросмотр">👁</button>
                    {perms.canEdit && (
                      <button onClick={() => openEdit(obj.id)} style={styles.btnIcon} title="Редактировать">✏️</button>
                    )}
                    {perms.canExport && (
                      <>
                        <button onClick={() => exportObject(obj.id, 'pptx')} style={styles.btnIcon} title="PPTX">📊</button>
                        <button onClick={() => exportObject(obj.id, 'docx')} style={styles.btnIcon} title="DOCX">📄</button>
                      </>
                    )}
                    {perms.canDelete && (
                      <button
                        onClick={() => { if (window.confirm(`Удалить «${obj.name}»?`)) deleteObject(obj.id); }}
                        style={{ ...styles.btnIcon, color: '#EF4444' }}
                        title="Удалить"
                      >🗑</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  btnPrimary: {
    background: '#1C4ED8',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnGhost: {
    background: 'transparent',
    color: '#6B7280',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer',
  },
  btnIcon: {
    background: '#F3F4F6',
    border: 'none',
    borderRadius: 6,
    padding: '5px 8px',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  filterBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    flex: '1 1 220px',
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    fontSize: 14,
    background: '#fff',
    outline: 'none',
    minWidth: 180,
  },
  select: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    fontSize: 14,
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  tableWrap: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#6B7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #F0F2F5',
  },
  td: {
    padding: '14px 16px',
    color: '#374151',
    borderBottom: '1px solid #F7F8FA',
    verticalAlign: 'middle',
  },
  tr: {
    transition: 'background 0.1s',
  },
};
