import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PagInicio from './pages/paginicio';
import AuthPagina from './pages/autpagina';
import BovinoForm from './pages/bovinoform';
import { AuthProvider, useAuth } from './context/authcontext';
import BovinoDetailsPage from './pages/bovinodetallepag';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  console.log('NavBar - isAuth:', isAuthenticated);
  console.log('NavBar - user:', user);
  return (
    <nav style={{ backgroundColor: '#333', padding: '10px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em', fontWeight: 'bold' }}>El Gran Toro</Link>
        {isAuthenticated && (
          <>
            <Link to="/bovinos/registrarbovino" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Publicar Bovino</Link>
          </>
        )}
      </div>
      <div>
        {isAuthenticated ? (
          <span style={{ marginRight: '15px' }}>Hola, {user?.name || user?.email}</span>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Iniciar Sesión / Registrarse</Link>
        )}
        {isAuthenticated && (
          <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Cerrar Sesión</button>
        )}
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando autenticación...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<PagInicio />} />
          <Route path="/login" element={<AuthPagina />} />
          <Route path="/bovinos/:id" element={<BovinoDetailsPage />} /> 
          <Route path="/bovinos/registrarbovino" element={
            <PrivateRoute>
              <BovinoForm />
            </PrivateRoute>
          } />
          <Route path="/bovinos/:id/editarbovino" element={
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