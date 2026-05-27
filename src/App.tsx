import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Login } from './pages/Login';
import { ObjectList } from './pages/ObjectList';
import { ObjectEditor } from './components/ObjectEditor';
import { Preview } from './pages/Preview';
import { Notifications } from './components/Notifications';
import { ROLE_PERMISSIONS } from './types';

const Header: React.FC = () => {
  const { user, view, setView, logout } = useStore();
  if (!user) return null;

  const roleLabel = { admin: 'Администратор', editor: 'Редактор', viewer: 'Просмотрщик' }[user.role];

  return (
    <header style={{
      background: '#1A1D23',
      color: '#fff',
      padding: '0 32px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div
          style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', cursor: 'pointer' }}
          onClick={() => setView('list')}
        >
          ИнПАД
        </div>
        <nav>
          <button
            onClick={() => setView('list')}
            style={{
              background: view === 'list' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: view === 'list' ? '#fff' : 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Объекты
          </button>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{roleLabel}</span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#3B82F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14,
        }}>
          {user.name.charAt(0)}
        </div>
        <span style={{ fontSize: 14 }}>{user.name}</span>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            color: '#fff',
            cursor: 'pointer',
            marginLeft: 8,
          }}
        >
          Выйти
        </button>
      </div>
    </header>
  );
};

export default function App() {
  const { isAuthenticated, isLoadingAuth, checkAuth, view } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoadingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F8FA',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #E5E7EB',
            borderTopColor: '#1C4ED8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ marginTop: 16, color: '#6B7280' }}>Загрузка...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: '"Golos Text", system-ui, sans-serif' }}>
      {view !== 'preview' && <Header />}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'list' && <ObjectList />}
        {view === 'edit' && <ObjectEditor />}
        {view === 'preview' && <Preview />}
      </div>
      <Notifications />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700&family=Golos+Text:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus, textarea:focus {
          border-color: #1C4ED8 !important;
          box-shadow: 0 0 0 3px rgba(28,78,216,0.1);
        }
        button:hover { opacity: 0.85; }
        tr:hover td { background: #FAFBFF !important; }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}