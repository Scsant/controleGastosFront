import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const TestUsuarios = () => {
  const { accessToken } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testarEndpoints = async () => {
    if (!accessToken) {
      setError('Token não disponível');
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('🔍 Testando endpoints de usuários...');
    console.log('🔑 Token:', accessToken?.substring(0, 30) + '...');

    const endpoints = [
      '/users/',
      '/auth/user/',
      '/user/',
      '/users/me/',
      '/api/users/',
      '/auth/users/'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testando ${endpoint}`);
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`✅ Sucesso em ${endpoint}:`, response.data);
        
        if (Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else if (response.data.id) {
          setUsuarios([response.data]);
        }
        break; // Se deu certo, para de testar
      } catch (err) {
        console.log(`❌ Erro em ${endpoint}:`, err.response?.status, err.response?.data);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
      testarEndpoints();
    }
  }, [accessToken]);

  return (
    <div style={{ padding: '20px', background: '#2a2a2a', color: 'white', margin: '20px', borderRadius: '8px' }}>
      <h3>🧪 Teste de Usuários - Debug</h3>
      
      <button 
        onClick={testarEndpoints} 
        style={{ 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
        disabled={loading}
      >
        {loading ? 'Testando...' : 'Testar Endpoints'}
      </button>

      {error && (
        <div style={{ background: '#dc3545', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          Erro: {error}
        </div>
      )}

      {usuarios.length > 0 && (
        <div>
          <h4>👥 Usuários encontrados:</h4>
          <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
            {JSON.stringify(usuarios, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.8 }}>
        <p>📋 Verifique o console do navegador para logs detalhados</p>
        <p>🔧 Token: {accessToken ? '✅ Presente' : '❌ Ausente'}</p>
      </div>
    </div>
  );
};

export default TestUsuarios;
