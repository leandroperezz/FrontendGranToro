import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { createBovino, getBovinoById, updateBovino, getAllRazas } from '../services/api';

const BovinoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    razaId: '',
    edad: '',
    peso: '',
    genetica: '',
    precio: '',
    descripcion: '',
    efectividad: '',
    ubicacion: '',
    vendedorId: user?.id || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [razas, setRazas] = useState([]);
  const [loadingRazas, setLoadingRazas] = useState(true);
  const [errorRazas, setErrorRazas] = useState(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchRazas = async () => {
      try {
        const data = await getAllRazas();
        setRazas(data);
      } catch (err) {
        setErrorRazas('Error al cargar las razas: ' + err.message);
      } finally {
        setLoadingRazas(false);
      }
    };
    if (isAuthenticated) {
      fetchRazas();
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (isEditing) {
      const fetchBovino = async () => {
        setLoading(true);
        try {
          const bovinoData = await getBovinoById(id);
          if (bovinoData.vendedorId !== user.id) {
            setError('No tienes permiso para editar este bovino.');
            setLoading(false);
            return;
          }
          setFormData(bovinoData);
        } catch (err) {
          setError('Error al cargar el bovino para edición: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBovino();
    }
  }, [id, isEditing, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!formData.vendedorId) {
      setError('Error: El vendedorId no está establecido. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateBovino(id, formData);
        setMessage('Bovino actualizado con éxito.');
      } else {
        await createBovino(formData);
        setMessage('Bovino creado con éxito.');
        setFormData({
          razaId: '', edad: '', peso: '', genetica: '', precio: '',
          descripcion: '', efectividad: '', ubicacion: '', vendedorId: user.id
        });
      }
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Error al guardar el bovino: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Necesitas iniciar sesión para acceder a esta página.</div>;
  }
  if (loading && isEditing) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos del bovino...</div>;
  if (error && isEditing) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  if (loadingRazas) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando razas...</div>;
  if (errorRazas) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{errorRazas}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isEditing ? 'Editar Bovino' : 'Crear Nuevo Bovino'}</h2>
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="edad" style={{ display: 'block', marginBottom: '5px' }}>Edad (en años):</label>
          <input type="number" name="edad" id="edad" value={formData.edad} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="peso" style={{ display: 'block', marginBottom: '5px' }}>Peso (kg):</label>
          <input type="number" name="peso" id="peso" value={formData.peso} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="precio" style={{ display: 'block', marginBottom: '5px' }}>Precio (USD):</label>
          <input type="number" name="precio" id="precio" value={formData.precio} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="razaId" style={{ display: 'block', marginBottom: '5px' }}>Raza:</label>
          <select
            name="razaId"
            id="razaId"
            value={formData.razaId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Selecciona una raza</option>
            {razas.map(raza => (
              <option key={raza.id} value={raza.id}>
                {raza.nombre}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="genetica" style={{ display: 'block', marginBottom: '5px' }}>Genética (Código "aAa"):</label>
          <input type="text" name="genetica" id="genetica" value={formData.genetica} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
          <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" style={{ width: '100%', padding: '8px' }}></textarea>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="efectividad" style={{ display: 'block', marginBottom: '5px' }}>Efectividad (Porcentaje):</label>
          <input type="number" name="efectividad" id="efectividad" value={formData.efectividad} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="ubicacion" style={{ display: 'block', marginBottom: '5px' }}>Ubicación:</label>
          <input type="text" name="ubicacion" id="ubicacion" value={formData.ubicacion} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        {user && <p style={{ marginTop: '10px', fontSize: '0.9em' }}>Vendedor ({user.email})</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar Bovino' : 'Crear Bovino')}
        </button>
      </form>
    </div>
  );
};

export default BovinoForm;