import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FiltroUsuarios.css';

const FiltroUsuarios = ({ onFilterChange, accessToken }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('👥 FiltroUsuarios renderizando...');
  
  // Debug - verificar se o componente está sendo renderizado
  React.useEffect(() => {
    console.log('👥 FiltroUsuarios montado no DOM');
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const buscarUsuarios = async () => {
      setLoading(true);
      try {
        // Tentar diferentes endpoints para buscar usuários
        const endpoints = ['/users/', '/auth/users/', '/api/users/'];
        
        for (const endpoint of endpoints) {
          try {
            const response = await api.get(endpoint, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            if (response.data && Array.isArray(response.data)) {
              setUsuarios(response.data);
              console.log('✅ Usuários encontrados:', response.data);
              break;
            }
          } catch (err) {
            console.log(`❌ Erro em ${endpoint}:`, err.response?.status);
          }
        }
      } catch (err) {
        console.error('❌ Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarUsuarios();
  }, [accessToken]);

  const handleUsuarioChange = (e) => {
    const userId = e.target.value;
    setUsuarioSelecionado(userId);
    
    if (userId === '') {
      onFilterChange(null); // Mostrar todos
    } else {
      const usuario = usuarios.find(u => u.id === parseInt(userId));
      onFilterChange({
        usuarioId: parseInt(userId),
        usuarioNome: usuario ? (usuario.first_name || usuario.username) : 'Usuário'
      });
    }
  };

  const limparFiltro = () => {
    setUsuarioSelecionado('');
    onFilterChange(null);
  };

  return (
    <div className="filtro-usuarios">
      <div className="filtro-header">
        <h4>👥 Filtrar por Pessoa</h4>
        <button 
          className="btn-limpar-usuario"
          onClick={limparFiltro}
          title="Ver todos os usuários"
        >
          🗑️ Todos
        </button>
      </div>

      <div className="filtro-controles">
        <select 
          value={usuarioSelecionado} 
          onChange={handleUsuarioChange}
          className="select-usuario"
          disabled={loading}
        >
          <option value="">Todos os membros da família</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.first_name || usuario.username}
            </option>
          ))}
        </select>
        
        {loading && <span className="loading-usuarios">Carregando usuários...</span>}
      </div>

      {usuarioSelecionado && (
        <div className="usuario-selecionado">
          👤 Visualizando: <strong>
            {usuarios.find(u => u.id === parseInt(usuarioSelecionado))?.first_name || 
             usuarios.find(u => u.id === parseInt(usuarioSelecionado))?.username}
          </strong>
        </div>
      )}
    </div>
  );
};

export default FiltroUsuarios;
