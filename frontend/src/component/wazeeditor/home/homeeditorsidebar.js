import {
  FaExclamationTriangle,
  FaGlobe,
  FaTimes,
   FaBars
} 
from 'react-icons/fa';
import '../../../css/editor.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const SidebarItem = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="btn btn-outline-secondary w-100 d-flex align-items-center gap-3 text-start px-3 py-2"
  >
    {/* largeur fixe : toutes les icônes occupent le même espace, les titres restent alignés */}
    <span
      className="d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: '32px', height: '32px' }}
    >
      {icon}
    </span>
    <span className="fw-semibold">{label}</span>
  </button>
);

const MapEditorSidebar = () => {
const navigate = useNavigate();
const location = useLocation();
const label = new URLSearchParams(location.search).get('label');
const [isOpen, setIsOpen] = useState(!label);
  useEffect(() => {
    if (label) setIsOpen(false);
  }, [label]);

  if (!isOpen) {
    return (
      <button
        type="button"
        className="btn btn-light shadow"
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <FaBars size={18} />
      </button>
    );
  }

  return (
    <div
      className="card p-4"
      style={{
        width: '300px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        borderTopRightRadius: '15px',
        borderBottomRightRadius: '15px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* En-tête : titre à gauche, bouton fermer à droite, centrés verticalement */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <h2 className="h5 fw-semibold m-0">Guidiny</h2>
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center p-0"
            style={{ width: '36px', height: '36px' }}
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation : espacement régulier entre les items */}
        <nav className="d-flex flex-column gap-2">
          <SidebarItem
            icon={<FaExclamationTriangle size={22} />}
            label="Dangers"
            onClick={() => navigate('/dangers')}
          />
          <SidebarItem
            icon={<FaGlobe size={22} />}
            label="Lieux"
            onClick={() => navigate('/lieux')}
          />
        </nav>

        <button
          type="button"
          className="btn btn-info w-100 mt-auto"
          onClick={() => navigate('/dashboard')}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default MapEditorSidebar;