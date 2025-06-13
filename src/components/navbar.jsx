import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import './navbar.css';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">El Gran Toro</Link>
        {isAuthenticated && (
          <>
            <Link to="/bovinos/new" className="navbar-link">Publicar Bovino</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <span className="navbar-user">Hola, {user?.name || user?.email}</span>
        ) : (
          <Link to="/auth" className="navbar-link">Iniciar Sesión / Registrarse</Link>
        )}
        {isAuthenticated && (
          <button onClick={logout} className="navbar-logout-btn">Cerrar Sesión</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;