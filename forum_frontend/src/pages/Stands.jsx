import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Stands.css';

export default function Stands() {
  const { user } = useAuth();
  const [stands, setStands]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editStand, setEditStand]     = useState(null);
  const [form, setForm]               = useState({ nom: '', description: '', disponible: true });
  const [filter, setFilter]           = useState('tous');

  const isAdmin      = user?.role === 'admin';
  const isEntreprise = user?.role === 'entreprise';
  const aDejaUnStand = isEntreprise && stands.some(s => s.entrepriseId === user?.id);

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/stands')
      .then(({ data }) => setStands(data))
      .finally(() => setLoading(false));
  }, []);

  const displayedStands = filter === 'libres'
    ? stands.filter(s => s.disponible)
    : filter === 'occupes'
      ? stands.filter(s => !s.disponible)
      : stands;

  const openAdd = () => {
    setEditStand(null);
    setForm({ nom: '', description: '', disponible: true });
    setShowModal(true);
  };

  const openEdit = (stand) => {
    setEditStand(stand);
    setForm({ nom: stand.nom, description: stand.description, disponible: stand.disponible });
    setShowModal(true);
  };

  // ── Ajouter / Modifier ────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      if (editStand) {
        const { data } = await api.put(`/stands/${editStand.id}`, form);
        setStands(ss => ss.map(s => s.id === editStand.id ? data : s));
      } else {
        const { data } = await api.post('/stands', form);
        setStands(ss => [...ss, data]);
      }
      setShowModal(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  // ── Supprimer ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce stand ?')) return;
    try {
      await api.delete(`/stands/${id}`);
      setStands(ss => ss.filter(s => s.id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  // ── Réserver ──────────────────────────────────────────────────────────────
  const handleReserver = async (id) => {
    try {
      const { data } = await api.post(`/stands/${id}/reserver`);
      setStands(ss => ss.map(s => s.id === id ? data : s));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la réservation.');
    }
  };

  // ── Libérer ───────────────────────────────────────────────────────────────
  const handleLiberer = async (id) => {
    if (!window.confirm('Voulez-vous vraiment libérer ce stand ?')) return;
    try {
      const { data } = await api.delete(`/stands/${id}/reserver`);
      setStands(ss => ss.map(s => s.id === id ? data : s));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la libération.');
    }
  };

  if (loading) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Chargement...</p></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1></h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isEntreprise && aDejaUnStand && (
            <span className="stand-already-reserved">Vous avez déjà un stand réservé</span>
          )}
          <div className="stands-filter">
            {[
              { key: 'tous',    label: 'Tous' },
              { key: 'libres',  label: 'Libres' },
              { key: 'occupes', label: 'Occupés' },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd}>+ Ajouter un stand</button>
          )}
        </div>
      </div>

      <div className="stands-grid">
        {displayedStands.map(stand => (
          <div key={stand.id} className={`stand-card card ${!stand.disponible ? 'stand-occupied' : ''}`}>
            <div className="stand-card-header">
              <h3 className="stand-name">{stand.nom}</h3>
              <span className={`badge ${stand.disponible ? 'badge-libre' : 'badge-occupe'}`}>
                {stand.disponible ? 'Libre' : 'Occupé'}
              </span>
            </div>
            <p className="stand-desc">{stand.description}</p>
            {!stand.disponible && stand.entreprise && (
              <div className="stand-entreprise">{stand.entreprise}</div>
            )}
            <div className="stand-actions">
              {isEntreprise && stand.disponible && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleReserver(stand.id)}
                  disabled={aDejaUnStand}
                  title={aDejaUnStand ? 'Vous avez déjà réservé un stand' : ''}
                >
                  Réserver
                </button>
              )}
              {isEntreprise && !stand.disponible && stand.entrepriseId === user.id && (
                <button className="btn btn-danger btn-sm" onClick={() => handleLiberer(stand.id)}>
                  Libérer
                </button>
              )}
              {isAdmin && (
                <>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(stand)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(stand.id)}>Supprimer</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayedStands.length === 0 && (
        <div className="card empty-state"><p>Aucun stand trouvé pour ce filtre.</p></div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editStand ? 'Modifier le stand' : 'Nouveau stand'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nom du stand</label>
              <input className="form-input" value={form.nom} onChange={e => setForm(f => ({...f, nom: e.target.value}))} placeholder="Stand A1" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} style={{resize:'vertical'}} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Description du stand..." />
            </div>
            <div className="form-group">
              <label className="form-label">Disponibilité</label>
              <select className="form-select" value={form.disponible ? 'oui' : 'non'} onChange={e => setForm(f => ({...f, disponible: e.target.value === 'oui'}))}>
                <option value="oui">Disponible</option>
                <option value="non">Non disponible</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editStand ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
