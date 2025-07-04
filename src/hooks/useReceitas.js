import { useEffect, useState } from 'react';
import api from '../services/api';

const useReceitas = (token) => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    // Buscar apenas as receitas do usuário atual
    api.get('/receitas/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setReceitas(res.data || []);
      })
      .catch((err) => {
        console.error('❌ Erro ao buscar receitas:', err.response?.data || err.message);
        // Em caso de erro, tentar endpoint alternativo
        return api.get('/receitas/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { all: true } // Parâmetro para buscar todas
        });
      })
      .then((res) => {
        if (res) {
          setReceitas(res.data);
        }
      })
      .catch((err) => {
        console.error('❌ Erro final ao buscar receitas:', err.response?.data || err.message);
        setReceitas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return { receitas, loading };
};

export default useReceitas;
