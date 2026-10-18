import React, { useState, useEffect,useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../user.js/auth';

const blueIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
  iconSize: [21, 34],
  iconAnchor: [10, 34],
});

async function saveMarkerToBackend(marker) {
  if (!marker.description.trim()) throw new Error('La description est obligatoire');
  if (!marker.imageFile) throw new Error("L'image est obligatoire");

  const [lat, lng] = marker.location;

  const form = new FormData();
  form.append('type', marker.type);
  form.append('description', marker.description);
  form.append('address', marker.address);
  form.append('creator', marker.creator);
  form.append('location', JSON.stringify({ lat, lng }));
  form.append('image', marker.imageFile);

  const res = await fetch('/api/markers', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Erreur lors de l’enregistrement');
  }
  return data;
}

async function deleteMarkerFromBackend(markerId) {
  const res = await fetch(`/api/markers/${markerId}`, { method: 'DELETE' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erreur lors de la suppression');
  }
}

function MapClickHandler({ onMapClick, isEnabled }) {
  useMapEvents({
    click(e) {
      if (isEnabled) onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

function MarkerDynamicPopup({ marker, onUpdate, onFieldChange, eventHandlers }) {
  const [saving, setSaving] = useState(false);

  const saveAndClose = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { marker: saved } = await saveMarkerToBackend(marker);
      onUpdate(marker.id, {
        ...marker,
        id: saved.id,
        image: saved.image,        // URL définitive renvoyée par le serveur
        imageFile: undefined,
        location: [saved.location.lat, saved.location.lng],
        isSaved: true,
      });
      toast.success('Marqueur enregistré avec succès');
    } catch (err) {
      toast.error(err.message || 'Vérifiez vos données');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMarkerFromBackend(marker.id);
      onUpdate(marker.id, null);
      toast.success('Marqueur supprimé !');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <Marker position={marker.location} icon={blueIcon} eventHandlers={eventHandlers}>
      <Popup autoClose={false} closeOnClick={false}>
        {!marker.isSaved ? (
          <div style={{ width: 220 }}>
            <label>Description:</label>
            <textarea
              value={marker.description}
              onChange={e => onFieldChange(marker.id, 'description', e.target.value)}
              style={{ width: '100%' }}
            />
            <label>Adresse:</label>
            <input
              type="text"
              value={marker.address}
              onChange={e => onFieldChange(marker.id, 'address', e.target.value)}
              style={{ width: '100%' }}
            />
            <label>Image:</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                  toast.error('Image trop lourde (2 Mo maximum)');
                  e.target.value = '';
                  return;
                }
                // le fichier part au serveur ; le blob sert seulement d'aperçu
                onFieldChange(marker.id, 'imageFile', file);
                onFieldChange(marker.id, 'image', URL.createObjectURL(file));
              }}
              style={{ width: '100%' }}
            />
            {marker.imageFile && (
              <img
                src={marker.image}
                alt="aperçu"
                style={{ width: '100%', marginTop: 6, borderRadius: 4 }}
              />
            )}
            <label>Créateur:</label>
            <input
              type="text"
              value={marker.creator}
              disabled
              style={{ width: '100%', background: '#f0f0f0' }}
            />
            <button
              onClick={saveAndClose}
              disabled={saving}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '6px',
                background: saving ? '#7aa97a' : 'green',
                color: 'white',
                border: 'none',
                borderRadius: 4
              }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        ) : (
          <div style={{ width: 220 }}>
            <strong>Type:</strong> {marker.type}<br />
            <strong>Description:</strong><br />
            <div>{marker.description || 'Aucune description'}</div>
            <strong>Adresse:</strong><br />
            <div>{marker.address}</div>
            {marker.image && !marker.image.startsWith('blob:') && (
              <>
                <strong>Image:</strong><br />
                <img src={marker.image} alt="marker" style={{ width: '100%' }} />
              </>
            )}
            <strong>Créateur:</strong><br />
            <div>{marker.creator}</div>

            <button
              style={{
                marginTop: 10,
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                padding: '6px',
                width: '100%',
                borderRadius: 4,
              }}
              onClick={handleDelete}
            >
              Supprimer
            </button>
          </div>
        )}
      </Popup>
    </Marker>
  );
}

export default function MyMap() {
  const { user } = useAuth();
const [searchParams, setSearchParams] = useSearchParams();
const label = searchParams.get('label');  
const [markers, setMarkers] = useState([]);
  const placingRef = useRef(false);  
  const handleFieldChange = (id, field, value) => {
    setMarkers(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleUpdate = (id, updated) => {
    if (updated === null) {
      setMarkers(prev => prev.filter(m => m.id !== id));
    } else {
      setMarkers(prev => prev.map(m => (m.id === id ? updated : m)));
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || 'Adresse non trouvée';
    } catch {
      return 'Adresse non trouvée';
    }
  };

const handleMapClick = async (position) => {
    const userId = user?.id || user?._id || user?.userId;
    if (!label || !userId || placingRef.current) return;

    placingRef.current = true;
    const currentLabel = label;
    setSearchParams({}, { replace: true });

    try {
      const address = await getAddressFromCoords(position[0], position[1]);
      const newMarker = {
        id: Date.now(),
        type: currentLabel,
        description: '',
        address,
        location: position,
        image: '',
        imageFile: null,
        creator: userId,
        isSaved: false
      };
      setMarkers(prev => [...prev, newMarker]);
    } finally {
      placingRef.current = false;
    }
  };


  useEffect(() => {
    const userId = user?.id || user?._id || user?.userId;
    if (!userId) return;

    const fetchUserMarkers = async () => {
      try {
        const response = await fetch(`/api/markers/user/${userId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const loadedMarkers = data.markers
          .filter(m => m.location?.lat != null && m.location?.lng != null)
          .map(m => ({
            id: m.id,
            type: m.type,
            description: m.description,
            address: m.address,
            location: [m.location.lat, m.location.lng],
            image: m.image,
            creator: m.creator,
            isSaved: true,
          }));

        setMarkers(loadedMarkers);
      } catch (err) {
        toast.error('Impossible de charger les marqueurs');
      }
    };

    fetchUserMarkers();
  }, [user]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[35.82539, 10.63699]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} isEnabled={!!label} />
        {markers.map(marker => (
          <MarkerDynamicPopup
            key={marker.id}
            marker={marker}
            onUpdate={handleUpdate}
            onFieldChange={handleFieldChange}
          />
        ))}
      </MapContainer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}