import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('salon_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  // POST /api/login
  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    const userData = { ...data.user, token: data.token };
    localStorage.setItem('salon_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // POST /api/register
  const register = async (nom, email, password, role) => {
    await api.post('/register', { nom, email, password, role });
    return true;
  };

  // POST /api/logout
  const logout = async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('salon_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};
