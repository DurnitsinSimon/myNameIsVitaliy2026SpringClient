import React from 'react';
import { useStore } from '../store/useStore';

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const COLORS = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  error: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
};

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 380,
    }}>
      {notifications.map((n) => {
        const c = COLORS[n.type];
        return (
          <div
            key={n.id}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.text,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <span>{ICONS[n.type]}</span>
            <span style={{ flex: 1, fontSize: 14 }}>{n.message}</span>
            <button
              onClick={() => removeNotification(n.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.5, fontSize: 16 }}
            >✕</button>
          </div>
        );
      })}
    </div>
  );
};
