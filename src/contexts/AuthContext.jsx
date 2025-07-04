// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // 👈 Novo estado reativo
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const res = await api.post('/token/', { username, password });
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access); // 👈 Seta no estado
      setUsuario({ username });
      navigate('/'); // Navega para a rota principal (Dashboard)
    } catch (error) {
      alert('Login inválido. Verifique seu usuário ou senha.');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null); // 👈 Limpa o estado também
    setUsuario(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token); // 👈 Restaura o token no estado
      setUsuario({ username: 'usuario logado' }); // Simulação, ou use um verify
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
