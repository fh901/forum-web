import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Programme.css';

export default function Programme() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const fileRef = useRef(null);

  const [programme, setProgramme] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editMode, setEditMode]   = useState(false);
  const [draft, setDraft]         = useState({});
  const [saved, setSaved]         = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/programme')
      .then(({ data }) => setProgramme(data))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = () => {
    setDraft({ titre: programme.titre, contenu: programme.contenu });
    setEditMode(true);
    setSaved(false);
  };

  // ── Sauvegarder texte ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!draft.titre?.trim()) return;
    try {
      const { data } = await api.put('/programme', { titre: draft.titre, contenu: draft.contenu });
      setProgramme(data);
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  // ── Upload fichier ────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Format non supporté. Veuillez utiliser un fichier PDF, Word ou image.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('fichier', file);
      const { data } = await api.post('/programme/fichier', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProgramme(data);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de l\'upload.');
    }
  };

  const handleInputFile = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Supprimer fichier ─────────────────────────────────────────────────────
  const handleDeleteFile = async () => {
    if (!window.confirm('Supprimer le fichier joint ?')) return;
    try {
      const { data } = await api.delete('/programme/fichier');
      setProgramme(data);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  if (loading) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Chargement...</p></div>;
  if (!programme) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Aucun programme disponible.</p></div>;

  const isPDF   = programme.fichier?.type === 'application/pdf';
  const isImage = programme.fichier?.type?.startsWith('image/');

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title-text"></h1>
        {isAdmin && !editMode && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={openEdit}>Modifier le programme</button>
          </div>
        )}
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>Programme enregistré avec succès.</div>}

      {/* ── MODE LECTURE ── */}
      {!editMode && (
        <div className="programme-layout">
          <div className="card programme-card">
            <div className="programme-card-header">
              <h2 className="programme-titre">{programme.titre}</h2>
              <span className="programme-date">Mis à jour le {programme.dateMAJ}</span>
            </div>
            <div className="divider" />
            <pre className="programme-contenu">{programme.contenu}</pre>
          </div>

          {programme.fichier && (
            <div className="card programme-file-card">
              <div className="programme-file-header">
                <span className="programme-file-title">Document joint</span>
                {isAdmin && (
                  <button className="btn btn-sm btn-danger" onClick={handleDeleteFile}>
                    Supprimer le fichier
                  </button>
                )}
              </div>
              {isPDF && (
                <iframe src={programme.fichier.url} className="programme-pdf-viewer" title="Programme PDF" />
              )}
              {isImage && (
                <img src={programme.fichier.url} alt="Programme" className="programme-img-viewer" />
              )}
              {!isPDF && !isImage && (
                <div className="programme-file-info">
                  <span className="programme-file-icon">📄</span>
                  <span className="programme-file-name">{programme.fichier.nom}</span>
                </div>
              )}
              <a href={programme.fichier.url} download={programme.fichier.nom}
                className="btn btn-outline btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Télécharger le fichier
              </a>
            </div>
          )}

          {isAdmin && (
            <div
              className={`programme-upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.docx"
                style={{ display: 'none' }} onChange={handleInputFile} />
              <div className="upload-icon">+</div>
              <p className="upload-text">
                {programme.fichier
                  ? 'Cliquez ou déposez un fichier pour remplacer le document actuel'
                  : 'Cliquez ou déposez un fichier pour joindre le programme'}
              </p>
              <p className="upload-hint">PDF, Word, Image — max 10 Mo</p>
            </div>
          )}
        </div>
      )}

      {/* ── MODE ÉDITION ── */}
      {editMode && isAdmin && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Titre du programme</label>
            <input className="form-input" value={draft.titre}
              onChange={e => setDraft(d => ({ ...d, titre: e.target.value }))}
              placeholder="Ex : Programme de la journée — Salon Tech 2025" />
          </div>
          <div className="form-group">
            <label className="form-label">Contenu du programme</label>
            <p className="form-hint">Écrivez le déroulé heure par heure. Chaque ligne = une activité.</p>
            <textarea className="form-input programme-textarea" rows={14}
              value={draft.contenu}
              onChange={e => setDraft(d => ({ ...d, contenu: e.target.value }))}
              placeholder={`08h30 — Accueil\n09h00 — Cérémonie d'ouverture\n...`} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setEditMode(false)}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
