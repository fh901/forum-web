import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './MonEspace.css';

export default function MonEspace() {
  const { user } = useAuth();
  const [inscriptions, setInscriptions]   = useState([]);
  const [conferences, setConferences]     = useState([]);
  const [monStand, setMonStand]           = useState(null);
  const [maConference, setMaConference]   = useState(null);
  const [bio, setBio]                     = useState('');
  const [bioSaved, setBioSaved]           = useState(false);
  const [loading, setLoading]             = useState(true);

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/mon-espace')
      .then(({ data }) => {
        if (data.user?.bio)        setBio(data.user.bio);
        if (data.inscriptions)     setInscriptions(data.inscriptions);
        if (data.conferences)      setConferences(data.conferences);
        if (data.stand)            setMonStand(data.stand);
        if (data.conference)       setMaConference(data.conference);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Se désinscrire (étudiant) ─────────────────────────────────────────────
  const handleDesinscrire = async (id) => {
    if (!window.confirm('Voulez-vous vraiment vous désinscrire de cette conférence ?')) return;
    try {
      await api.delete(`/conferences/${id}/inscrire`);
      setInscriptions(ins => ins.filter(i => i !== id));
      setConferences(cs => cs.filter(c => c.id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la désinscription.');
    }
  };

  // ── Libérer stand (entreprise) ────────────────────────────────────────────
  const handleLibererStand = async () => {
    if (!window.confirm('Voulez-vous vraiment libérer votre stand ?')) return;
    try {
      await api.delete(`/stands/${monStand.id}/reserver`);
      setMonStand(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la libération.');
    }
  };

  // ── Sauvegarder bio (conférencier) ────────────────────────────────────────
  const handleSaveBio = async () => {
    try {
      await api.put('/mon-espace/bio', { bio });
      setBioSaved(true);
      setTimeout(() => setBioSaved(false), 3000);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const formatDate = (d) => new Date(d + 'T00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const roleLabel = { etudiant: 'Étudiant', entreprise: 'Entreprise', conferencier: 'Conférencier' };
  const roleColor = { etudiant: '#10B981', entreprise: '#F59E0B', conferencier: '#8B5CF6' };

  if (loading) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Chargement...</p></div>;

  return (
    <div className="page-wrapper">

      {/* Carte profil */}
      <div className="profile-card card">
        <div className="profile-avatar" style={{ background: roleColor[user?.role] }}>
          {user?.nom?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.nom}</h2>
          <p className="profile-email">{user?.email}</p>
          <span className="badge badge-role">{roleLabel[user?.role]}</span>
        </div>
      </div>

      {/* Vue Étudiant */}
      {user?.role === 'etudiant' && (
        <div>
          <div className="section-title">Mes conférences inscrites</div>
          {conferences.length === 0 ? (
            <div className="card empty-state">
              <p>Vous n'êtes inscrit à aucune conférence.<br />Rendez-vous sur la page <strong>Planning</strong> pour vous inscrire.</p>
            </div>
          ) : (
            <div className="conf-list">
              {conferences.map(conf => (
                <div key={conf.id} className="card conf-item">
                  <div className="conf-item-info">
                    <h3 className="conf-item-title">{conf.titre}</h3>
                    <div className="conf-item-meta">
                      <span>{formatDate(conf.date)}</span>
                      <span>{conf.heureDebut} – {conf.heureFin}</span>
                      <span>{conf.salle}</span>
                      <span>{conf.speaker}</span>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDesinscrire(conf.id)}>
                    Se désinscrire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vue Entreprise */}
      {user?.role === 'entreprise' && (
        <div>
          <div className="section-title">Mon stand réservé</div>
          {!monStand ? (
            <div className="card empty-state">
              <p>Vous n'avez pas encore réservé de stand.<br />Rendez-vous sur la page <strong>Stands</strong> pour en réserver un.</p>
            </div>
          ) : (
            <div className="card stand-detail">
              <div className="stand-detail-header">
                <div>
                  <h2 className="stand-detail-name">{monStand.nom}</h2>
                  <p className="stand-detail-desc">{monStand.description}</p>
                </div>
                <span className="badge badge-occupe" style={{ alignSelf: 'flex-start' }}>Réservé</span>
              </div>
              <div className="divider" />
              <div className="stand-detail-info">
                <div className="stand-info-item">
                  <span className="stand-info-label">Entreprise</span>
                  <span className="stand-info-value">{monStand.entreprise}</span>
                </div>
                <div className="stand-info-item">
                  <span className="stand-info-label">Statut</span>
                  <span className="stand-info-value" style={{ color: 'var(--red)' }}>Occupé</span>
                </div>
              </div>
              <button className="btn btn-danger" style={{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick={handleLibererStand}>
                Libérer le stand
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vue Conférencier */}
      {user?.role === 'conferencier' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div className="section-title">Ma conférence assignée</div>
            {!maConference ? (
              <div className="card empty-state">
                <p>Aucune conférence ne vous est encore assignée.</p>
              </div>
            ) : (
              <div className="card conf-speaker-card">
                <div className="conf-speaker-badge">Votre session</div>
                <h2 className="conf-speaker-title">{maConference.titre}</h2>
                <p className="conf-speaker-desc">{maConference.description}</p>
                <div className="conf-speaker-meta">
                  <div className="meta-item"><span>Date :</span><span>{formatDate(maConference.date)}</span></div>
                  <div className="meta-item"><span>Horaire :</span><span>{maConference.heureDebut} – {maConference.heureFin}</span></div>
                  <div className="meta-item"><span>Salle :</span><span>{maConference.salle}</span></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="section-title">Ma biographie</div>
            <div className="card" style={{ padding: '1.5rem' }}>
              {bioSaved && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>Biographie enregistrée avec succès.</div>}
              <div className="form-group">
                <label className="form-label">Votre description / biographie</label>
                <textarea
                  className="form-input"
                  rows={5}
                  style={{ resize: 'vertical' }}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Décrivez votre parcours, vos domaines d'expertise..."
                />
              </div>
              <button className="btn btn-primary" onClick={handleSaveBio}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
