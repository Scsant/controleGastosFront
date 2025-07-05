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
    console.log('🔑 Tentando fazer login com:', { username, url: import.meta.env.VITE_API_URL });
    
    try {
      const res = await api.post('/token/', { username, password });
      console.log('✅ Login bem-sucedido:', res.data);
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access); // 👈 Seta no estado
      setUsuario({ username });
      navigate('/'); // Navega para a rota principal (Dashboard)
    } catch (error) {
      console.error('❌ Erro completo no login:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ URL tentada:', error.config?.url);
      
      if (error.response?.status === 500) {
        alert('Erro interno do servidor. O sistema está sendo configurado. Tente novamente em alguns minutos.');
      } else if (error.response?.status === 401) {
        alert('Login inválido. Verifique seu usuário ou senha.');
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorFields = Object.keys(errorData);
          const errorMessage = errorFields.map(field => `${field}: ${errorData[field]}`).join(', ');
          alert(`Erro de validação: ${errorMessage}`);
        } else {
          alert('Dados inválidos. Verifique os campos.');
        }
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        alert('Erro no login. Tente novamente.');
      }
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
