import React, { useEffect, useState } from 'react';
import { getAllBovinos } from '../services/api';
import { getAllRazas } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import './paginicio.css';

const PagInicio = () => {
  const [bovinos, setBovinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    razaId: '',
    pesoMin: '',
    pesoMax: '',
    precioMin: '',
    precioMax: '',
    ubicacion: ''
  });

  const [razas, setRazas] = useState([]);
  const [loadingRazas, setLoadingRazas] = useState(true);
  const [errorRazas, setErrorRazas] = useState(null);
  const { user, isAuthenticated } = useAuth();

useEffect(() => {
    const fetchRazas = async () => {
      try {
        const data = await getAllRazas();
        setRazas(data);
      } catch (err) {
        setErrorRazas('Error al cargar las razas para el filtro: ' + err.message);
      } finally {
        setLoadingRazas(false);
      }
    };
    fetchRazas();
  }, []);

  const fetchBovinos = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const data = await getAllBovinos(activeFilters);
      setBovinos(data);
    } catch (err) {
      setError('Error al cargar los bovinos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBovinos();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  if (loadingRazas) return <div className="loading-message">Cargando filtros de raza...</div>;
  if (errorRazas) return <div className="error-message">{errorRazas}</div>;

  if (loading) return <div className="loading-message">Cargando bovinos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container homepage-container">
      <h1 className="page-title">Catálogo de Bovinos</h1>

      <div className="filters-section">
        <h3>Filtros</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="razaId" style={{ display: 'block', marginBottom: '5px' }}>Raza:</label>
            <select
              name="razaId"
              id="razaId"
              value={filters.razaId}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">Todas las Razas</option>
              {razas.map(raza => (
                <option key={raza.id} value={raza.id}>
                  {raza.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pesoMin">Peso Mín (kg):</label>
            <input type="number" name="pesoMin" id="pesoMin" value={filters.pesoMin} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="pesoMax">Peso Máx (kg):</label>
            <input type="number" name="pesoMax" id="pesoMax" value={filters.pesoMax} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="precioMin">Precio Mín (USD):</label>
            <input type="number" name="precioMin" id="precioMin" value={filters.precioMin} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="precioMax">Precio Máx (USD):</label>
            <input type="number" name="precioMax" id="precioMax" value={filters.precioMax} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="ubicacion">Ubicación:</label>
            <input type="text" name="ubicacion" id="ubicacion" value={filters.ubicacion} onChange={handleFilterChange} />
          </div>
        </div>
      </div>

      {bovinos.length === 0 ? (
        <p className="no-results-message">No se encontraron bovinos que coincidan con los filtros.</p>
      ) : (
        <div className="bovino-grid">
          {bovinos.map((bovino) => (
            <div key={bovino.id} className="bovino-card">
              {bovino.imagenUrl && (
                <div className="bovino-image-container">
                  <img
                    src={`http://localhost:3000${bovino.imagenUrl}`}
                  />
                </div>
              )}
              <div className="bovino-details-content">
                <h3 className="bovino-card-title">{`Bovino`}</h3>
                <p><strong>Raza:</strong> {bovino.raza ? bovino.raza.nombre : 'Desconocida'}</p>
                <p><strong>Peso:</strong> {bovino.peso} kg</p>
                <p><strong>Precio:</strong> ${bovino.precio} USD</p>
                <p><strong>Ubicación:</strong> {bovino.ubicacion}</p>
                {isAuthenticated && user?.id === bovino.vendedorId ? (
                  <Link to={`/bovinos/${bovino.id}/editarbovino`} className="bovino-card-details-link" style={{ backgroundColor: '#28a745' }}>
                    Editar Bovino
                  </Link>
                ) : (
                  <Link to={`/bovinos/${bovino.id}`} className="bovino-card-details-link" style={{ backgroundColor: '#007bff' }}>
                    Ver Detalles / Comprar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagInicio;