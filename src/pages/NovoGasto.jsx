import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import './NovoGasto.css';

const NovoGasto = () => {
  const authContext = useContext(AuthContext);
  
  // Verificar se o contexto está disponível
  if (!authContext) {
    return <div>Carregando...</div>;
  }
  
  const { accessToken } = authContext;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data_gasto: '',
    categoria: '',
    forma_pagamento: '',
    observacoes: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Opções de Forma de Pagamento
  const FORMA_PAGAMENTO_CHOICES = [
    { value: 'cartao_credito', label: 'Cartão de Crédito' },
    { value: 'cartao_debito', label: 'Cartão de Débito' },
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'pix', label: 'Pix' },
    { value: 'boleto', label: 'Boleto' },
    { value: 'transferencia', label: 'Transferência' },
    { value: 'outros', label: 'Outros' },
  ];

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!accessToken) {
        toast.error('Token de acesso não disponível');
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.get('/categorias/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('📋 Categorias carregadas:', res.data);
        setCategorias(res.data);
      } catch (err) {
        console.error('❌ Erro ao buscar categorias:', err.response?.data || err.message);
        toast.error('Erro ao carregar categorias');
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, [accessToken, navigate]);

  // Função para converter valor para formato numérico
  const formatarValor = (valorString) => {
    if (!valorString) return 0;
    
    // Remove todos os caracteres não numéricos exceto vírgula e ponto
    let valorLimpo = valorString.toString().replace(/[^\d,.-]/g, '');
    
    // Se houver vírgula, assumir que é separador decimal brasileiro
    if (valorLimpo.includes(',')) {
      valorLimpo = valorLimpo.replace('.', '').replace(',', '.');
    }
    
    const valorNumerico = parseFloat(valorLimpo);
    return isNaN(valorNumerico) ? 0 : valorNumerico;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação da descrição
    if (!form.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (form.descricao.trim().length < 3) {
      newErrors.descricao = 'Descrição deve ter pelo menos 3 caracteres';
    }

    // Validação do valor
    if (!form.valor) {
      newErrors.valor = 'Valor é obrigatório';
    } else {
      const valorNumerico = formatarValor(form.valor);
      console.log('🔍 Validando valor:', { original: form.valor, formatado: valorNumerico });
      
      if (valorNumerico <= 0) {
        newErrors.valor = 'Valor deve ser maior que zero';
      } else if (valorNumerico > 999999.99) {
        newErrors.valor = 'Valor máximo permitido é R$ 999.999,99';
      }
    }

    // Validação da data
    if (!form.data_gasto) {
      newErrors.data_gasto = 'Data é obrigatória';
    } else {
      const dataSelecionada = new Date(form.data_gasto);
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);
      
      if (dataSelecionada > hoje) {
        newErrors.data_gasto = 'Data não pode ser futura';
      }
    }

    // Validação da categoria
    if (!form.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    // Validação da forma de pagamento
    if (!form.forma_pagamento) {
      newErrors.forma_pagamento = 'Forma de pagamento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleValueChange = (values) => {
    setForm({ ...form, valor: values.value });
    if (errors.valor) {
      setErrors({ ...errors, valor: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    
    // Converter valor para formato numérico
    const valorNumerico = formatarValor(form.valor);

    // Validar se a data está no formato correto
    let dataFormatada = form.data_gasto;
    if (dataFormatada) {
      const dataObj = new Date(dataFormatada);
      // Garantir que a data seja no formato YYYY-MM-DD
      dataFormatada = dataObj.toISOString().split('T')[0];
    }

    const payload = {
      descricao: form.descricao.trim(),
      valor: valorNumerico,
      data_gasto: dataFormatada,
      categoria: parseInt(form.categoria),
      forma_pagamento: form.forma_pagamento,
      observacoes: form.observacoes.trim(),
    };

    console.log('🚀 Enviando payload:', JSON.stringify(payload, null, 2));
    console.log('🔑 Token:', accessToken ? 'Presente' : 'Ausente');
    console.log('🏷️ Categoria selecionada:', form.categoria, '-> ID:', parseInt(form.categoria));
    console.log('💰 Valor original:', form.valor, '-> Numérico:', valorNumerico);

    try {
      const response = await api.post('/gastos/', payload);
      
      console.log('✅ Resposta do servidor:', response.data);
      toast.success('Gasto adicionado com sucesso!');
      navigate('/'); // Navega para a página principal (Dashboard)
    } catch (err) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Erro ao adicionar gasto:', err.response?.data || err.message);
      console.error('📦 Payload enviado:', payload);
      console.error('📊 Status:', err.response?.status);
      console.error('📋 Headers de resposta:', err.response?.headers);
      
      const errorData = err.response?.data;
      let errorMessage = 'Erro ao adicionar gasto. Verifique os dados.';
      
      if (errorData) {
        if (typeof errorData === 'object') {
          // Se for um objeto com erros de validação
          const errorFields = Object.keys(errorData);
          if (errorFields.length > 0) {
            const errorDetails = errorFields.map(field => {
              const fieldError = errorData[field];
              if (Array.isArray(fieldError)) {
                return `${field}: ${fieldError.join(', ')}`;
              }
              return `${field}: ${fieldError}`;
            }).join(', ');
            errorMessage = `Erro de validação: ${errorDetails}`;
          }
        } else {
          errorMessage = errorData;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <h1>Novo Gasto</h1>
      
      {isLoading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>Carregando categorias...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            className={errors.descricao ? 'error' : ''}
          />
          {errors.descricao && <span className="error-message">{errors.descricao}</span>}
        </div>

        <div className="form-group">
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            placeholder="Valor"
            value={form.valor}
            onValueChange={handleValueChange}
            className={errors.valor ? 'error' : ''}
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
        </div>

        <div className="form-group">
          <input
            type="date"
            name="data_gasto"
            value={form.data_gasto}
            onChange={handleChange}
            className={errors.data_gasto ? 'error' : ''}
          />
          {errors.data_gasto && <span className="error-message">{errors.data_gasto}</span>}
        </div>

        <div className="form-group">
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={errors.categoria ? 'error' : ''}
            disabled={isLoading}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
          {errors.categoria && <span className="error-message">{errors.categoria}</span>}
        </div>

        <div className="form-group">
          <select
            name="forma_pagamento"
            value={form.forma_pagamento}
            onChange={handleChange}
            className={errors.forma_pagamento ? 'error' : ''}
          >
            <option value="">Selecione a forma de pagamento</option>
            {FORMA_PAGAMENTO_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.forma_pagamento && <span className="error-message">{errors.forma_pagamento}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="observacoes"
            placeholder="Observações (opcional)"
            value={form.observacoes}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          className={isSubmitting ? 'loading' : ''}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Gasto'}
        </button>
      </form>
    </div>
  );
};

export default NovoGasto;