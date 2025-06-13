import React, { useState, useEffect  } from 'react';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';
import './autpagina.css';

const AuthPagina = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [telefono, setTelefono] = useState('');
  const [message, setMessage] = useState('');

  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      const result = await login({ email, password });
      if (result.success) {
        setMessage('Login exitoso. Redirigiendo...');
        setTimeout(() => {
        navigate('/');
      }, 100);
      } 
      else {
        setMessage(result.message || 'Error al iniciar sesión.');
      }
    } 
    else {
      const result = await register({ name, email, password, location, telefono });
      if (result.success) {
        setMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
        setLocation('');
        setTelefono('');
      } else {
        setMessage(result.message || 'Error al registrar usuario.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="location">Ubicación:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="form-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input type="text" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required={!isLogin} placeholder="Ej: 5491234567890" />
            </div>
          </div>
        )}
        <button type="submit" className="auth-btn">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>
      <p className="auth-toggle-text">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="auth-toggle-btn"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </p>
    </div>
  );
};

export default AuthPagina;