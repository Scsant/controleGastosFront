import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const DebugUsuarios = () => {
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const debugAPI = async () => {
      if (!accessToken) {
        console.log('❌ Token não disponível');
        return;
      }

      console.log('🔍 INICIANDO DEBUG DOS USUÁRIOS');
      console.log('🔑 Token disponível:', accessToken.substring(0, 30) + '...');

      // Teste 1: Tentar listar usuários
      try {
        const response = await api.get('/users/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('✅ Usuários encontrados:', response.data);
        
        // Teste 2: Para cada usuário, tentar criar uma receita de teste
        for (const user of response.data) {
          console.log(`🧪 Testando usuário ${user.id} (${user.username})...`);
          
          try {
            const testPayload = {
              descricao: `TESTE_USER_${user.id}`,
              valor: 1.0,
              data_receita: '2024-01-01',
              categoria: 1,
              fonte: 'outros',
              observacoes: 'teste automatico',
              usuario: user.id,
            };

            await api.post('/receitas/', testPayload, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });

            console.log(`✅ USUÁRIO ${user.id} (${user.username}) FUNCIONA!`);
            
            // Tentar deletar a receita teste
            try {
              const receitas = await api.get('/receitas/', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              const testeReceita = receitas.data.find(r => r.descricao === `TESTE_USER_${user.id}`);
              if (testeReceita) {
                await api.delete(`/receitas/${testeReceita.id}/`, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });
                console.log(`🗑️ Receita teste do usuário ${user.id} deletada`);
              }
            } catch (deleteErr) {
              console.log(`⚠️ Não foi possível deletar receita teste do usuário ${user.id}`);
            }

          } catch (err) {
            console.log(`❌ Usuário ${user.id} (${user.username}) falhou:`, err.response?.data);
          }
        }

      } catch (err) {
        console.log('❌ Erro ao buscar usuários:', err.response?.data);

        // Teste alternativo: testar IDs diretos
        console.log('🔄 Tentando IDs diretos...');
        for (let id = 1; id <= 10; id++) {
          try {
            const testPayload = {
              descricao: `TESTE_ID_${id}`,
              valor: 1.0,
              data_receita: '2024-01-01',
              categoria: 1,
              fonte: 'outros',
              observacoes: 'teste direto',
              usuario: id,
            };

            await api.post('/receitas/', testPayload, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });

            console.log(`✅ ID DIRETO ${id} FUNCIONA!`);
            
            // Deletar receita teste
            try {
              const receitas = await api.get('/receitas/', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              const testeReceita = receitas.data.find(r => r.descricao === `TESTE_ID_${id}`);
              if (testeReceita) {
                await api.delete(`/receitas/${testeReceita.id}/`, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });
                console.log(`🗑️ Receita teste ID ${id} deletada`);
              }
            } catch (deleteErr) {
              console.log(`⚠️ Não foi possível deletar receita teste ID ${id}`);
            }

          } catch (err) {
            console.log(`❌ ID ${id} falhou:`, err.response?.data);
          }
        }
      }

      console.log('🏁 DEBUG CONCLUÍDO');
    };

    debugAPI();
  }, [accessToken]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#000', 
      color: '#0f0', 
      padding: '10px', 
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      🔍 Debug rodando... Verifique o console
    </div>
  );
};

export default DebugUsuarios;
