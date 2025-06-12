import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PagInicio from './pages/paginicio';
import AutPagina from './pages/autpagina';
import BovinoForm from './pages/bovinoform';
import { AuthProvider, useAut } from './context/autcontext';

const NavBar = () => {
  const { user, isAut, logout } = useAut();
  return (
    <nav style={{ backgroundColor: '#333', padding: '10px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em', fontWeight: 'bold' }}>El Gran Toro</Link>
        {isAut && (
          <>
            <Link to="/bovinos/new" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Publicar Bovino</Link>
          </>
        )}
      </div>
      <div>
        {isAut ? (
          <span style={{ marginRight: '15px' }}>Hola, {user?.name || user?.email}</span>
        ) : (
          <Link to="/auth" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Iniciar Sesión / Registrarse</Link>
        )}
        {isAut && (
          <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Cerrar Sesión</button>
        )}
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAut, loading } = useAut();
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando autenticación...</div>;
  }
  return isAut ? children : <Navigate to="/auth" />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<PagInicio />} />
          <Route path="/auth" element={<AutPagina />} />
          <Route path="/bovinos/new" element={
            <PrivateRoute>
              <BovinoForm />
            </PrivateRoute>
          } />
          <Route path="/bovinos/:id/edit" element={
            <PrivateRoute>
              <BovinoForm />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;