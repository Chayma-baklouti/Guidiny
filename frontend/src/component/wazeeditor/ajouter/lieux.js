import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FaCar, FaStore, FaUtensils, FaTheaterMasks } from 'react-icons/fa';
const MapEditorPage = () => {
  const { id } = useParams();
  
  return <div>Éditeur de carte de l'utilisateur {id}</div>;
};

const lieuxMenuData = [
  { label: 'Entretien automobile', link: '/lieuxentretien', icon: <FaCar /> },
  { label: 'Commerces et services', link: '/services', icon: <FaStore /> },
  { label: 'Restauration', link: '/restauration', icon: <FaUtensils /> },
  { label: 'Culture et divertissement', link: '/culture-divertissement', icon: <FaTheaterMasks /> },
];
const LieuxMenuPage = ({ onBack }) => {
const navigate = useNavigate();
const goToEditor = (link) => {
    navigate(link);
  };
  return (
  <div
    className="card p-4 d-flex flex-column"
    style={{
      width: '300px',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      borderTopRightRadius: '15px',
      borderBottomRightRadius: '15px',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    }}
  >
    <h3 className="h5 fw-semibold pb-3 mb-3 border-bottom">
      Catégories de lieux
    </h3>

    <div className="d-flex flex-column gap-2 overflow-auto">
      {lieuxMenuData.map((category) => (
        <button
          key={category.label}
          type="button"
          onClick={() => goToEditor(category.link)}
          className="btn btn-outline-secondary w-100 d-flex align-items-center gap-3 text-start px-3 py-2"
        >
          {/* boîte de largeur fixe : tous les titres restent alignés */}
          <span
            className="d-flex align-items-center justify-content-center flex-shrink-0 fs-4"
            style={{ width: '36px', height: '36px' }}
          >
            {category.icon}
          </span>
          <span className="fw-semibold">{category.label}</span>
        </button>
      ))}
    </div>

    <button
      type="button"
      onClick={() => navigate('/editor')}
      className="btn btn-info w-100 mt-auto"
    >
      Retour
    </button>
  </div>
);
};

export default LieuxMenuPage;
