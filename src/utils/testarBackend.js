// Teste para verificar se o backend está funcionando
import api from '../services/api';

export const testarBackend = async (accessToken) => {
  console.log('🧪 Iniciando teste do backend...');
  
  try {
    // Teste 1: Verificar se o token está válido
    const responseAuth = await api.get('/auth/user/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Token válido, usuário:', responseAuth.data);
    
    // Teste 2: Buscar gastos
    const responseGastos = await api.get('/gastos/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Gastos encontrados:', responseGastos.data);
    
    // Teste 3: Buscar receitas
    const responseReceitas = await api.get('/receitas/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Receitas encontradas:', responseReceitas.data);
    
    return {
      usuario: responseAuth.data,
      gastos: responseGastos.data,
      receitas: responseReceitas.data
    };
    
  } catch (error) {
    console.error('❌ Erro no teste do backend:', error);
    return null;
  }
};
