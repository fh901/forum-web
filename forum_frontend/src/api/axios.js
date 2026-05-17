import axios from 'axios';

// ─── Instance Axios centrale ─────────────────────────────────────────────────
// Toute requête vers l'API Laravel passe par cet objet.
// Changer APP_URL en production si nécessaire.

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// ── Injecter automatiquement le token Bearer ──────────────────────────────────
api.interceptors.request.use(config => {
  const stored = localStorage.getItem('salon_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return config;
});

// ── Rediriger vers /login si le token expire (401) ────────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('salon_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
