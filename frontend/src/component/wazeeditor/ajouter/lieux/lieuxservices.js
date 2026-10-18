import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const MapEditorPage = () => {
  const { id } = useParams();
  
  return <div>Éditeur de carte de l'utilisateur {id}</div>;
};

const lieuxServicesData = [
    {
      label: 'Supermarché',
      icon: '🛒',
    },
    {
      label: 'Pharmacie',
      icon: '💊',
    }
  ];
  
const LieuxserviceMenuPage = () => {
  const navigate = useNavigate();

  const goToEditor = (label) => {
    navigate(`/editor?label=${encodeURIComponent(label)}`);
  };

  return (
  <div
    className="card p-4"
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
    <h3 className="h5 fw-semibold pb-3 mb-3 border-bottom">Cultures</h3>

    <div className="d-flex flex-column gap-2">
      {lieuxServicesData.map((category) => (
        <button
          key={category.label}
          type="button"
          onClick={() => goToEditor(category.label)}
          className="btn btn-outline-secondary w-100 d-flex align-items-center gap-3 text-start px-3 py-2"
        >
          {/* boîte de largeur fixe : les titres restent alignés */}
          <span
            className="d-flex align-items-center justify-content-center flex-shrink-0 fs-4"
            style={{ width: '36px', height: '36px' }}
          >
            {category.icon}
          </span>

          <span className="d-flex flex-column">
            <span className="fw-semibold" style={{ color: category.color }}>
              {category.label}
            </span>
            <small className="text-muted">{category.description}</small>
          </span>
        </button>
      ))}
    </div>

    <button
      type="button"
      onClick={() => goToEditor('lieux')}
      className="btn btn-info w-100 mt-auto"
    >
      Retour
    </button>
  </div>
);}

export default LieuxserviceMenuPage;
