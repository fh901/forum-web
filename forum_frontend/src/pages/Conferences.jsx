import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Conferences.css';

export default function Conferences() {
  const { user } = useAuth();
  const [conferences, setConferences]   = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editConf, setEditConf]         = useState(null);
  const [form, setForm]                 = useState({ titre: '', description: '', speaker: '', salle: '', date: '', heureDebut: '', heureFin: '' });
  const [filterDate, setFilterDate]     = useState('');

  const isAdmin        = user?.role === 'admin';
  const isEtudiant     = user?.role === 'etudiant';
  const isConferencier = user?.role === 'conferencier';

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/conferences')
      .then(({ data }) => {
        setConferences(data.conferences);
        setInscriptions(data.inscriptions);
      })
      .catch(() => setError('Impossible de charger les conférences.'))
      .finally(() => setLoading(false));
  }, []);

  const displayedConfs = isConferencier
    ? conferences.filter(c => c.speakerId === user.id)
    : filterDate
      ? conferences.filter(c => c.date === filterDate)
      : conferences;

  const uniqueDates = [...new Set(conferences.map(c => c.date))].sort();

  const openAdd = () => {
    setEditConf(null);
    setForm({ titre: '', description: '', speaker: '', salle: '', date: '', heureDebut: '', heureFin: '' });
    setShowModal(true);
  };

  const openEdit = (conf) => {
    setEditConf(conf);
    setForm({ titre: conf.titre, description: conf.description, speaker: conf.speaker, salle: conf.salle, date: conf.date, heureDebut: conf.heureDebut, heureFin: conf.heureFin });
    setShowModal(true);
  };

  // ── Ajouter / Modifier ────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      if (editConf) {
        const { data } = await api.put(`/conferences/${editConf.id}`, form);
        setConferences(cs => cs.map(c => c.id === editConf.id ? data : c));
      } else {
        const { data } = await api.post('/conferences', form);
        setConferences(cs => [...cs, data]);
      }
      setShowModal(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  // ── Supprimer ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette conférence ?')) return;
    try {
      await api.delete(`/conferences/${id}`);
      setConferences(cs => cs.filter(c => c.id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  // ── Inscrire / Désinscrire ────────────────────────────────────────────────
  const handleInscrire = async (id) => {
    try {
      if (inscriptions.includes(id)) {
        await api.delete(`/conferences/${id}/inscrire`);
        setInscriptions(ins => ins.filter(i => i !== id));
      } else {
        await api.post(`/conferences/${id}/inscrire`);
        setInscriptions(ins => [...ins, id]);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de l\'inscription.');
    }
  };

  const formatDate = (d) => new Date(d + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  if (loading) return <div className="page-wrapper"><p style={{padding:'2rem'}}>Chargement...</p></div>;
  if (error)   return <div className="page-wrapper"><p style={{padding:'2rem',color:'red'}}>{error}</p></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title-text"></h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          >
            <option value="">Toutes les dates</option>
            {uniqueDates.map(d => (
              <option key={d} value={d}>{formatDate(d)}</option>
            ))}
          </select>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd}>
              + Ajouter une conférence
            </button>
          )}
        </div>
      </div>

      {isConferencier && displayedConfs.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon" style={{fontSize:'2rem',marginBottom:'0.75rem'}}>—</div>
          <p>Aucune conférence ne vous est assignée pour le moment.</p>
        </div>
      ) : (
        uniqueDates
          .filter(d => !filterDate || d === filterDate)
          .map(date => {
            const dayConfs = displayedConfs.filter(c => c.date === date);
            if (dayConfs.length === 0) return null;
            return (
              <div key={date} className="planning-day">
                <div className="day-header">
                  <span className="day-label">{formatDate(date)}</span>
                </div>
                <div className="card table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Conférence</th>
                        <th>Horaire</th>
                        <th>Salle</th>
                        <th>Intervenant</th>
                        {(isEtudiant || isAdmin) && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {dayConfs.map(conf => (
                        <tr key={conf.id}>
                          <td>
                            <div className="conf-title">{conf.titre}</div>
                            <div className="conf-desc">{conf.description}</div>
                          </td>
                          <td>
                            <div className="time-badge">{conf.heureDebut} – {conf.heureFin}</div>
                          </td>
                          <td>
                            <span className="salle-badge">{conf.salle}</span>
                          </td>
                          <td className="speaker-cell">{conf.speaker}</td>
                          {(isEtudiant || isAdmin) && (
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {isEtudiant && (
                                  inscriptions.includes(conf.id) ? (
                                    <button className="btn btn-sm btn-danger" onClick={() => handleInscrire(conf.id)}>
                                      Se désinscrire
                                    </button>
                                  ) : (
                                    <button className="btn btn-sm btn-success" onClick={() => handleInscrire(conf.id)}>
                                      S'inscrire
                                    </button>
                                  )
                                )}
                                {isAdmin && (
                                  <>
                                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(conf)}>Modifier</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(conf.id)}>Supprimer</button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editConf ? 'Modifier la conférence' : 'Nouvelle conférence'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input className="form-input" value={form.titre} onChange={e => setForm(f => ({...f, titre: e.target.value}))} placeholder="Titre de la conférence" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} style={{resize:'vertical'}} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Description..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Intervenant</label>
                <input className="form-input" value={form.speaker} onChange={e => setForm(f => ({...f, speaker: e.target.value}))} placeholder="Dr. Nom" />
              </div>
              <div className="form-group">
                <label className="form-label">Salle</label>
                <input className="form-input" value={form.salle} onChange={e => setForm(f => ({...f, salle: e.target.value}))} placeholder="Amphi A" />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label className="form-label">Début</label>
                  <input type="time" className="form-input" value={form.heureDebut} onChange={e => setForm(f => ({...f, heureDebut: e.target.value}))} />
                </div>
                <div>
                  <label className="form-label">Fin</label>
                  <input type="time" className="form-input" value={form.heureFin} onChange={e => setForm(f => ({...f, heureFin: e.target.value}))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editConf ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
