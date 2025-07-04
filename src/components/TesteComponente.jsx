import React from 'react';

const TesteComponente = () => {
  console.log('🧪 TesteComponente renderizando...');
  
  return (
    <div style={{ 
      background: 'red', 
      color: 'white', 
      padding: '20px', 
      margin: '20px 0',
      border: '3px solid yellow'
    }}>
      <h2>🧪 TESTE - Se você vê isso, os componentes estão sendo renderizados!</h2>
      <p>Este é um componente de teste para verificar se a renderização está funcionando.</p>
    </div>
  );
};

export default TesteComponente;
