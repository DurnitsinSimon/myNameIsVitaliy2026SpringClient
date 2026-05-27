import React from 'react';
import { useStore } from '../store/useStore';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

export const Preview: React.FC = () => {
  const { currentObject: obj, setView } = useStore();
  if (!obj) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Georgia, serif' }}>
      {/* Preview bar */}
      <div style={{
        background: '#1A1D23',
        color: '#fff',
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 13,
      }}>
        <span style={{ opacity: 0.7 }}>👁 Предпросмотр · Так объект будет выглядеть на inpad.ru</span>
        <button
          onClick={() => setView('edit')}
          style={{
            background: '#fff',
            color: '#1A1D23',
            border: 'none',
            borderRadius: 6,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Назад к редактированию
        </button>
      </div>

      {/* Hero */}
      <div style={{
        position: 'relative',
        height: 480,
        background: obj.mainImage
          ? `url(${obj.mainImage.url}) center/cover no-repeat`
          : 'linear-gradient(135deg, #1A1D23 0%, #374151 100%)',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', padding: '40px 60px', color: '#fff' }}>
          <div style={{ marginBottom: 10 }}>
            {obj.objectType && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                padding: '4px 14px',
                borderRadius: 999,
                fontSize: 13,
                marginRight: 10,
              }}>{obj.objectType}</span>
            )}
            {obj.status && (
              <span style={{
                background: STATUS_COLORS[obj.status],
                color: '#fff',
                padding: '4px 14px',
                borderRadius: 999,
                fontSize: 13,
              }}>{STATUS_LABELS[obj.status]}</span>
            )}
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 42, fontWeight: 700, lineHeight: 1.15 }}>
            {obj.name || 'Без названия'}
          </h1>
          <div style={{ fontSize: 16, opacity: 0.85, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {obj.city && <span>📍 {obj.city}</span>}
            {obj.yearRealized && <span>🏗 {obj.yearRealized}</span>}
            {obj.customer && <span>👤 {obj.customer}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>

        {/* Short description */}
        {obj.shortDescription && (
          <p style={{
            fontSize: 20, lineHeight: 1.7, color: '#374151',
            borderLeft: '4px solid #1C4ED8', paddingLeft: 24, marginBottom: 48,
            fontStyle: 'italic',
          }}>
            {obj.shortDescription}
          </p>
        )}

        {/* Full description */}
        {obj.fullDescription && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={headingStyle}>О проекте</h2>
            <p style={{ fontSize: 16, lineHeight: 1.9, color: '#4B5563' }}>{obj.fullDescription}</p>
          </div>
        )}

        {/* Characteristics */}
        {(obj.totalArea || obj.floorsCount || obj.buildingsCount || obj.parkingSpaces || obj.extraCharacteristics.length > 0) && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={headingStyle}>Технико-экономические показатели</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 1,
              background: '#E5E7EB',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              {[
                { label: 'Общая площадь', value: obj.totalArea ? `${Number(obj.totalArea).toLocaleString('ru-RU')} м²` : null },
                { label: 'Этажность', value: obj.floorsCount ? `${obj.floorsCount} эт.` : null },
                { label: 'Корпусов', value: obj.buildingsCount || null },
                { label: 'Парковочных мест', value: obj.parkingSpaces || null },
                ...obj.extraCharacteristics.map((kv) => ({ label: kv.key, value: kv.value })),
              ].filter((r) => r.value).map((row, i) => (
                <div key={i} style={{ background: '#fff', padding: '18px 20px' }}>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1D23' }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {obj.gallery.filter((img) => img.onSite).length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={headingStyle}>Галерея</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 12,
            }}>
              {obj.gallery.filter((img) => img.onSite).map((img) => (
                <div key={img.id} style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <img src={img.preview} alt={img.caption} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  {img.caption && (
                    <div style={{ padding: '8px 12px', background: '#F9FAFB', fontSize: 13, color: '#6B7280' }}>{img.caption}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {obj.team.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={headingStyle}>Команда</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}>
              {obj.team.map((m, i) => (
                <div key={i} style={{ background: '#F9FAFB', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{m.role}</div>
                  <div style={{ fontWeight: 600, color: '#1A1D23' }}>{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 32, display: 'flex', gap: 32, flexWrap: 'wrap', color: '#6B7280', fontSize: 14 }}>
          {obj.yearDesign && <span>Год проектирования: <strong>{obj.yearDesign}</strong></span>}
          {obj.inpadRole && <span>Роль ИНПАД: <strong>{obj.inpadRole}</strong></span>}
          {obj.address && <span>Адрес: <strong>{obj.address}</strong></span>}
        </div>
      </div>
    </div>
  );
};

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#1A1D23',
  marginBottom: 20,
  paddingBottom: 10,
  borderBottom: '2px solid #F0F2F5',
  fontFamily: 'Georgia, serif',
};
