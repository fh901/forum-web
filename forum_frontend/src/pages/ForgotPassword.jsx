import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoEnsa from '../assets/logo-ensa.png';
import api from '../api/axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <img src={logoEnsa} alt="ENSA Entreprises" />
        </div>
        <div className="auth-logo-divider" />
        <div className="auth-card-header">
          <h2>Mot de passe oublié</h2>
          <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {sent ? (
          <div className="forgot-success">
            <div className="forgot-success-icon">✓</div>
            <h3>Email envoyé</h3>
            <p>
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
              Vérifiez votre boîte de réception.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <input
                type="email"
                className="form-input"
                placeholder="exemple@ensa.ma"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '0.25rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <p className="auth-link-text" style={{ marginTop: '1.25rem' }}>
          <Link to="/login" className="auth-link">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
