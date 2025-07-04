import { useEffect, useState } from 'react';
import api from '../services/api';

const useExpenses = (token) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    // Buscar apenas os gastos do usuário atual
    api.get('/gastos/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setGastos(res.data || []);
      })
      .catch((err) => {
        console.error('❌ Erro ao buscar gastos:', err.response?.data || err.message);
        // Em caso de erro, tentar endpoint alternativo
        return api.get('/gastos/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { all: true } // Parâmetro para buscar todos
        });
      })
      .then((res) => {
        if (res) {
          setGastos(res.data);
        }
      })
      .catch((err) => {
        console.error('❌ Erro final ao buscar gastos:', err.response?.data || err.message);
        setGastos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return { gastos, loading };
};

export default useExpenses;

