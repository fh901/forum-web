import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoEnsa from '../assets/logo-ensa.png';
import './Auth.css';

export default function Register() {
  const [form, setForm]     = useState({ nom: '', email: '', password: '', role: 'etudiant' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await register(form.nom, form.email, form.password, form.role);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'etudiant',     label: 'Étudiant' },
    { value: 'entreprise',   label: 'Entreprise' },
    { value: 'conferencier', label: 'Conférencier' },
 
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo-wrap">
          <img src={logoEnsa} alt="ENSA Entreprises" />
        </div>

        <div className="auth-logo-divider" />

        {/* Titre */}
        <div className="auth-card-header">
          <h2>Créer un compte</h2>
          <p>Rejoignez le Forum Ensaj Entreprises</p>
        </div>

        {error   && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ Compte créé ! Redirection…</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                name="nom"
                className="form-input"
                placeholder="Ahmed Bennani"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="ahmed@ensa.ma"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Minimum 6 caractères"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Inscription…' : "S'inscrire"}
            </button>
          </form>
        )}

        <p className="auth-link-text">
          Déjà inscrit ?{' '}
          <Link to="/login" className="auth-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

