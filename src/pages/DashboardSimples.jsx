import React from 'react';
import FiltrosMensais from '../components/FiltrosMensais';
import FiltroUsuarios from '../components/FiltroUsuarios';

const DashboardSimples = () => {
  console.log('🏠 DashboardSimples renderizando...');
  
  return (
    <div style={{ padding: '20px', background: '#333', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard Simplificado</h1>
      
      <div style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
        <h2>Área dos Filtros</h2>
        
        <div style={{ border: '1px solid yellow', padding: '10px', margin: '10px 0' }}>
          <h3>Filtros Mensais:</h3>
          <FiltrosMensais onFilterChange={(f) => console.log('Filtro mensal:', f)} />
        </div>
        
        <div style={{ border: '1px solid yellow', padding: '10px', margin: '10px 0' }}>
          <h3>Filtros de Usuários:</h3>
          <FiltroUsuarios onFilterChange={(f) => console.log('Filtro usuário:', f)} accessToken="test" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSimples;
