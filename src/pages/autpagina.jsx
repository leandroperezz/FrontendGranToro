import React, { useState } from 'react';
import { useAut } from '../context/autcontext';
import { useNavigate } from 'react-router-dom';
import './autpagina.css';

const AutPagina = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const { login, register, isAutenticado } = useAut();
  const navigate = useNavigate();

  if (isAutenticado) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/');
      } 
      else {
        setMessage(result.message || 'Error al iniciar sesión.');
      }
    } 
    else {
      const result = await register({ name, email, password, location });
      if (result.success) {
        setMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
        setLocation('');
      } else {
        setMessage(result.message || 'Error al registrar usuario.');
      }
    }
  };

  return (
    <div className="aut-container">
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
          </div>
        )}
        <button type="submit" className="aut-btn">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>
      <p className="aut-toggle-text">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="aut-toggle-btn"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </p>
    </div>
  );
};

export default AutPagina;