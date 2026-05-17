import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoEnsa from '../assets/logo-ensa.png';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => setShowConfirm(true);

  const confirmLogout = async () => {
    setShowConfirm(false);
    await logout();
    navigate('/login');
  };

  const roleLabel = {
    admin:       'Administrateur',
    etudiant:    'Étudiant',
    entreprise:  'Entreprise',
    conferencier:'Conférencier',
  };

  const roleColor = {
    admin:       '#EF4444',
    etudiant:    '#10B981',
    entreprise:  '#F59E0B',
    conferencier:'#8B5CF6',
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">

          <NavLink to="/" className="navbar-logo">
            <img src={logoEnsa} alt="ENSAJ Entreprises" className="navbar-logo-img" />
          </NavLink>

          {user && (
            <div className="navbar-links">
              <NavLink to="/programme" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Programme
              </NavLink>
              <NavLink to="/conferences" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Conférences
              </NavLink>
              <NavLink to="/stands" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Stands
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}>
                  Espace Admin
                </NavLink>
              )}
              {user.role !== 'admin' && (
                <NavLink to="/mon-espace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Mon Espace
                </NavLink>
              )}
            </div>
          )}

          {user && (
            <div className="navbar-right">
              <div className="navbar-user">
                <div className="user-avatar" style={{ background: roleColor[user.role] }}>
                  {user.nom.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.nom}</span>
                  <span className="user-role" style={{ color: roleColor[user.role] }}>
                    {roleLabel[user.role]}
                  </span>
                </div>
              </div>
              <button className="btn-logout" onClick={handleLogoutClick}>
                Déconnexion
              </button>
            </div>
          )}

          {user && (
            <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
          )}
        </div>

        {user && menuOpen && (
          <div className="navbar-mobile">
            <NavLink to="/programme"  onClick={() => setMenuOpen(false)} className="mobile-link">Programme</NavLink>
            <NavLink to="/conferences"   onClick={() => setMenuOpen(false)} className="mobile-link">Conférences</NavLink>
            <NavLink to="/stands"     onClick={() => setMenuOpen(false)} className="mobile-link">Stands</NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin"    onClick={() => setMenuOpen(false)} className="mobile-link">Espace Admin</NavLink>
            )}
            {user.role !== 'admin' && (
              <NavLink to="/mon-espace" onClick={() => setMenuOpen(false)} className="mobile-link">Mon Espace</NavLink>
            )}
            <button className="mobile-link mobile-logout" onClick={handleLogoutClick}>Déconnexion</button>
          </div>
        )}
      </nav>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">?</div>
            <h3 className="confirm-title">Déconnexion</h3>
            <p className="confirm-text">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Annuler</button>
              <button className="btn btn-danger-solid" onClick={confirmLogout}>Oui, me déconnecter</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
