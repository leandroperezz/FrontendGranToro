import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBovinoById, deleteBovino } from '../services/api';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const BovinoDetailsPage = () => {
  const { id } = useParams();
  const [bovino, setBovino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBovino = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBovinoById(id);
        setBovino(data);
      } catch (err) {
        setError('Error al cargar los detalles del bovino: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBovino();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bovino?')) {
      try {
        setLoading(true);
        await deleteBovino(id);
        alert('Bovino eliminado con éxito.');
        navigate('/');
      } catch (err) {
        setError('Error al eliminar el bovino: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const sellerPhoneNumber = bovino?.propietario?.telefono;
  const whatsappMessage = `Hola, me interesa el bovino ID ${bovino?.id} (${bovino?.nombre || 'sin nombre'}) que vi en El Gran Toro.`;
  const whatsappLink = sellerPhoneNumber
    ? `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando detalles del bovino...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!bovino) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Bovino no encontrado.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Detalles del Bovino:</h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {bovino.imagenUrl && (
          <div style={{ flex: '1 1 300px', maxWidth: '100%', display: 'flex', justifyContent: 'center' }}>
          <img src={`http://localhost:3000${bovino.imagenUrl}`} alt={bovino.nombre || 'Bovino'} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }} />
      </div>
  )}
        <div style={{ flex: '2 1 400px' }}>
          <p><strong>Raza:</strong> {bovino.raza ? bovino.raza.nombre : 'Desconocida'}</p>
          <p><strong>Edad:</strong> {bovino.edad} años</p>
          <p><strong>Peso:</strong> {bovino.peso} kg</p>
          <p><strong>Precio:</strong> ${bovino.precio} USD</p>
          <p><strong>Genética (código aAa):</strong> {bovino.genetica || 'No especificado'}</p>
          <p><strong>Descripción:</strong> {bovino.descripcion || 'Sin descripción'}</p>
          <p><strong>Efectividad:</strong> {bovino.efectividad || 'No especificada'}%</p>
          <p><strong>Ubicación:</strong> {bovino.ubicacion || 'No especificada'}</p>
          <p><strong>Vendedor:</strong> {bovino.propietario ? bovino.propietario.name : 'Desconocido'} ({bovino.propietario ? bovino.propietario.email : ''})</p>
          {bovino.propietario?.telefono && (
            <p><strong>Teléfono del Vendedor:</strong> {bovino.propietario.telefono}</p>
          )}
          <p><strong>Publicado:</strong> {new Date(bovino.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        {isAuthenticated && user?.id !== bovino.vendedorId && (
          <>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                 style={{ padding: '10px 20px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '5px', marginRight: '10px' }}>
                Contactar por WhatsApp
              </a>
            )}
          </>
        )}

        {isAuthenticated && user?.id === bovino.vendedorId && (
          <>
            <Link to={`/bovinos/${bovino.id}/edit`}
                  style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', marginRight: '10px' }}>
              Editar Bovino
            </Link>
            <button onClick={handleDelete}
                    style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Eliminar Bovino
            </button>
          </>
        )}

        <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', marginLeft: '10px' }}>
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
};

export default BovinoDetailsPage;