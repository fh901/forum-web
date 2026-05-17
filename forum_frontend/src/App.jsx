import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Conferences from './pages/Conferences';
import Programme      from './pages/Programme';
import Stands         from './pages/Stands';
import AdminPanel     from './pages/AdminPanel';
import MonEspace      from './pages/MonEspace';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Publiques ── */}
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />

          {/* ── Protégées (tous rôles connectés) ── */}
          <Route path="/conferences" element={
            <ProtectedRoute><AppLayout><Conferences /></AppLayout></ProtectedRoute>
          } />
          <Route path="/planning" element={
            <ProtectedRoute><AppLayout><Conferences /></AppLayout></ProtectedRoute>
          } />
          <Route path="/programme" element={
            <ProtectedRoute><AppLayout><Programme /></AppLayout></ProtectedRoute>
          } />
          <Route path="/stands" element={
            <ProtectedRoute><AppLayout><Stands /></AppLayout></ProtectedRoute>
          } />
          <Route path="/mon-espace" element={
            <ProtectedRoute><AppLayout><MonEspace /></AppLayout></ProtectedRoute>
          } />

          {/* ── Admin uniquement ── */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AppLayout><AdminPanel /></AppLayout></ProtectedRoute>
          } />

          {/* ── Redirections ── */}
          <Route path="/"  element={<Navigate to="/conferences" replace />} />
          <Route path="*"  element={<Navigate to="/conferences" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
