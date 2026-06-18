import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { ObjectsPage } from './pages/ObjectsPage';
import { ObjectEditorPage } from './pages/ObjectEditorPage';
import { ObjectPreviewPage } from './pages/ObjectPreviewPage';
import { ExportPage } from './pages/ExportPage';
import { MediaPage } from './pages/MediaPage';
import { DictionariesPage } from './pages/DictionariesPage';
import { UsersPage } from './pages/UsersPage';
import { AuditPage } from './pages/AuditPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/objects" replace />} />
        <Route path="objects" element={<ObjectsPage />} />
        <Route path="objects/new" element={<ObjectEditorPage />} />
        <Route path="objects/:id" element={<ObjectEditorPage />} />
        <Route path="objects/:id/preview" element={<ObjectPreviewPage />} />
        <Route path="objects/:id/export" element={<ExportPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="media" element={<MediaPage />} />

        <Route
          path="dictionaries"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <DictionariesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AuditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
