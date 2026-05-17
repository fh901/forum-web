import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AdminPanel.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers]             = useState([]);
  const [conferences, setConferences] = useState([]);
  const [stands, setStands]           = useState([]);
  const [statsData, setStatsData]     = useState({ users: 0, conferences: 0, stands: 0, reservations: 0 });
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');

  const [showConfModal, setShowConfModal]   = useState(false);
  const [showStandModal, setShowStandModal] = useState(false);
  const [editConf, setEditConf]   = useState(null);
  const [editStand, setEditStand] = useState(null);
  const [confForm, setConfForm]   = useState({ titre: '', description: '', speaker: '', salle: '', date: '', heureDebut: '', heureFin: '' });
  const [standForm, setStandForm] = useState({ nom: '', description: '', disponible: true });

  const roleLabel = { admin: 'Admin', etudiant: 'Étudiant', entreprise: 'Entreprise', conferencier: 'Conférencier' };
  const roleColor = { admin: '#EF4444', etudiant: '#10B981', entreprise: '#F59E0B', conferencier: '#8B5CF6' };

  // ── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/conferences'),
      api.get('/stands'),
    ]).then(([statsRes, usersRes, confsRes, standsRes]) => {
      setStatsData(statsRes.data);
      setUsers(usersRes.data);
      setConferences(confsRes.data.conferences);
      setStands(standsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  // ── Utilisateurs ──────────────────────────────────────────────────────────
  const handleDeleteUser = async (id) => {
    if (id === user.id) { alert('Vous ne pouvez pas supprimer votre propre compte.'); return; }
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(us => us.filter(u => u.id !== id));
      setStatsData(s => ({ ...s, users: s.users - 1 }));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  // ── Conférences ───────────────────────────────────────────────────────────
  const openConfEdit = (conf) => {
    setEditConf(conf);
    setConfForm({ titre: conf.titre, description: conf.description, speaker: conf.speaker, salle: conf.salle, date: conf.date, heureDebut: conf.heureDebut, heureFin: conf.heureFin });
    setShowConfModal(true);
  };
  const openConfAdd = () => {
    setEditConf(null);
    setConfForm({ titre: '', description: '', speaker: '', salle: '', date: '', heureDebut: '', heureFin: '' });
    setShowConfModal(true);
  };
  const saveConf = async () => {
    try {
      if (editConf) {
        const { data } = await api.put(`/conferences/${editConf.id}`, confForm);
        setConferences(cs => cs.map(c => c.id === editConf.id ? data : c));
      } else {
        const { data } = await api.post('/conferences', confForm);
        setConferences(cs => [...cs, data]);
        setStatsData(s => ({ ...s, conferences: s.conferences + 1 }));
      }
      setShowConfModal(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };
  const deleteConf = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette conférence ?')) return;
    try {
      await api.delete(`/conferences/${id}`);
      setConferences(cs => cs.filter(c => c.id !== id));
      setStatsData(s => ({ ...s, conferences: s.conferences - 1 }));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    }
  };

  // ── Stands ────────────────────────────────────────────────────────────────
  const openStandEdit = (stand) => {
    setEditStand(stand);
    setStandForm({ nom: stand.nom, description: stand.description, disponible: stand.disponible });
    setShowStandModal(true);
  };
  const openStandAdd = () => {
    setEditStand(null);
    setStandForm({ nom: '', description: '', disponible: true });
    setShowStandModal(true);
  };
  const saveStand = async () => {
    try {
      if (editStand) {
        const { data } = await api.put(`/stands/${editStand.id}`, standForm);
        setStands(ss => ss.map(s => s.id === editStand.id ? data : s));
      } else {
        const { data } = await api.post('/stands', standForm);
        setStands(ss => [...ss, data]);
        setStatsData(s => ({ ...s, stands: s.stands + 1 }));
      }
      setShowStandModal(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };
  const deleteStand = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce stand ?')) return;
    try {
      await api.delete(`/stands/${id}`);
      setStands(ss => ss.filter(s => s.id !== id));
      setStatsData(s => ({ ...s, stands: s.stands - 1 }));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    }
  };

  const stats = [
    { value: statsData.users,        label: 'Utilisateurs',  color: '#000000a2' },
    { value: statsData.conferences,  label: 'Conférences',   color: '#000000a2' },
    { value: statsData.stands,       label: 'Stands',        color: '#000000a2' },
    { value: statsData.reservations, label: 'Réservations',  color: '#000000a2' },
  ];

  const tabs = [
    { id: 'overview',    label: "Vue d'ensemble" },
    { id: 'users',       label: 'Utilisateurs' },
    { id: 'conferences', label: 'Conférences' },
    { id: 'stands',      label: 'Stands' },
  ];

  if (loading) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Chargement...</p></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title-text"></h1>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            {stats.map(s => (
              <div className="stat-card" key={s.label}>
                <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="admin-grid-2">
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="section-title">Dernières conférences</div>
              {conferences.slice(0,3).map(c => (
                <div key={c.id} className="quick-item">
                  <div className="quick-item-main">
                    <strong>{c.titre}</strong>
                    <span>{c.date} — {c.salle}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="section-title">État des stands</div>
              {stands.slice(0,4).map(s => (
                <div key={s.id} className="quick-item">
                  <div className="quick-item-main">
                    <strong>{s.nom}</strong>
                    <span>{s.entreprise || 'Disponible'}</span>
                  </div>
                  <span className={`badge ${s.disponible ? 'badge-libre' : 'badge-occupe'}`}>
                    {s.disponible ? 'Libre' : 'Occupé'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Utilisateurs */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--slate)', fontWeight: 700 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: roleColor[u.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: 'white', flexShrink: 0 }}>
                          {u.nom.charAt(0)}
                        </div>
                        {u.nom}
                      </div>
                    </td>
                    <td style={{ color: 'var(--slate)', fontSize: '0.875rem' }}>{u.email}</td>
                    <td>
                      <span className="badge badge-role" style={{ background: `${roleColor[u.role]}18`, color: roleColor[u.role], borderColor: `${roleColor[u.role]}40` }}>
                        {roleLabel[u.role]}
                      </span>
                    </td>
                    <td>
                      {u.id !== user.id && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conférences */}
      {activeTab === 'conferences' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={openConfAdd}>+ Ajouter une conférence</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Titre</th><th>Date</th><th>Salle</th><th>Intervenant</th><th>Actions</th></tr></thead>
                <tbody>
                  {conferences.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.titre}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{c.date} — {c.heureDebut}–{c.heureFin}</td>
                      <td><span className="salle-badge">{c.salle}</span></td>
                      <td>{c.speaker}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => openConfEdit(c)}>Modifier</button>
                          <button className="btn btn-sm btn-danger"  onClick={() => deleteConf(c.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Stands */}
      {activeTab === 'stands' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={openStandAdd}>+ Ajouter un stand</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Stand</th><th>Description</th><th>Statut</th><th>Entreprise</th><th>Actions</th></tr></thead>
                <tbody>
                  {stands.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.nom}</strong></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--slate)', maxWidth: '200px' }}>{s.description}</td>
                      <td><span className={`badge ${s.disponible ? 'badge-libre' : 'badge-occupe'}`}>{s.disponible ? 'Libre' : 'Occupé'}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{s.entreprise || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => openStandEdit(s)}>Modifier</button>
                          <button className="btn btn-sm btn-danger"  onClick={() => deleteStand(s.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Conférence */}
      {showConfModal && (
        <div className="modal-overlay" onClick={() => setShowConfModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editConf ? 'Modifier la conférence' : 'Nouvelle conférence'}</h3>
              <button className="modal-close" onClick={() => setShowConfModal(false)}>✕</button>
            </div>
            {['titre','speaker','salle'].map(field => (
              <div className="form-group" key={field}>
                <label className="form-label">{field === 'speaker' ? 'Intervenant' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input className="form-input" value={confForm[field]} onChange={e => setConfForm(f => ({...f, [field]: e.target.value}))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={2} style={{resize:'vertical'}} value={confForm.description} onChange={e => setConfForm(f => ({...f, description: e.target.value}))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={confForm.date} onChange={e => setConfForm(f => ({...f, date: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Début</label>
                <input type="time" className="form-input" value={confForm.heureDebut} onChange={e => setConfForm(f => ({...f, heureDebut: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Fin</label>
                <input type="time" className="form-input" value={confForm.heureFin} onChange={e => setConfForm(f => ({...f, heureFin: e.target.value}))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowConfModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={saveConf}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stand */}
      {showStandModal && (
        <div className="modal-overlay" onClick={() => setShowStandModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editStand ? 'Modifier le stand' : 'Nouveau stand'}</h3>
              <button className="modal-close" onClick={() => setShowStandModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input className="form-input" value={standForm.nom} onChange={e => setStandForm(f => ({...f, nom: e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} style={{resize:'vertical'}} value={standForm.description} onChange={e => setStandForm(f => ({...f, description: e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Disponibilité</label>
              <select className="form-select" value={standForm.disponible ? 'oui' : 'non'} onChange={e => setStandForm(f => ({...f, disponible: e.target.value === 'oui'}))}>
                <option value="oui">Disponible</option>
                <option value="non">Non disponible</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowStandModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={saveStand}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
