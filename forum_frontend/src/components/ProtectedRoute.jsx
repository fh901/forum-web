import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protégée — redirige vers /login si non connecté.
 * Si adminOnly=true, redirige vers /planning si l'utilisateur n'est pas admin.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--blue-ghost)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--blue)', borderColor: 'var(--blue-pale)', width: 36, height: 36, borderWidth: 3, margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--slate)', fontWeight: 600 }}>Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/planning" replace />;

  return children;
}
