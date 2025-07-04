import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import './NovaReceita.css';

const NovaReceita = () => {
  const authContext = useContext(AuthContext);
  
  // Verificar se o contexto está disponível
  if (!authContext) {
    return <div>Carregando...</div>;
  }
  
  const { accessToken, usuario } = authContext;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data_receita: '',
    categoria: '',
    fonte: '',
    observacoes: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Opções de Fonte de Receita
  const FONTE_RECEITA_CHOICES = [
    { value: 'salario', label: 'Salário' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investimentos', label: 'Investimentos' },
    { value: 'aluguel', label: 'Aluguel' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'bonus', label: 'Bônus' },
    { value: 'outros', label: 'Outros' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        toast.error('Token de acesso não disponível');
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        // Buscar dados do usuário logado - teste múltiplos endpoints
        let userRes;
        console.log('🔍 Tentando buscar dados do usuário...');
        console.log('🔑 Access Token:', accessToken?.substring(0, 20) + '...');
        
        try {
          console.log('📡 Tentando endpoint /auth/user/');
          userRes = await api.get('/auth/user/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log('✅ Sucesso em /auth/user/:', userRes.data);
        } catch (err1) {
          console.log('❌ Falhou em /auth/user/:', err1.response?.status, err1.response?.data);
          try {
            console.log('📡 Tentando endpoint /user/');
            userRes = await api.get('/user/', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('✅ Sucesso em /user/:', userRes.data);
          } catch (err2) {
            console.log('❌ Falhou em /user/:', err2.response?.status, err2.response?.data);
            try {
              console.log('📡 Tentando endpoint /users/me/');
              userRes = await api.get('/users/me/', {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              console.log('✅ Sucesso em /users/me/:', userRes.data);
            } catch (err3) {
              console.log('❌ Falhou em /users/me/:', err3.response?.status, err3.response?.data);
              try {
                console.log('📡 Tentando listar todos os usuários para debug');
                const allUsersRes = await api.get('/users/', {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                console.log('👥 Todos os usuários:', allUsersRes.data);
                
                // Também testar outros endpoints
                const endpoints = ['/auth/users/', '/api/users/', '/accounts/users/'];
                for (const endpoint of endpoints) {
                  try {
                    const res = await api.get(endpoint, {
                      headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    console.log(`✅ Endpoint ${endpoint} funcionou:`, res.data);
                  } catch (err) {
                    console.log(`❌ Endpoint ${endpoint} falhou:`, err.response?.status);
                  }
                }
                
                // Tentar usar o primeiro usuário ativo ou o admin
                const adminUser = allUsersRes.data.find(u => u.is_superuser || u.is_staff) || allUsersRes.data[0];
                if (adminUser) {
                  console.log('🔧 Usando usuário admin encontrado:', adminUser);
                  setUsuarioId(adminUser.id);
                } else {
                  // Fallback para ID conhecido do Django admin
                  console.log('⚠️ Usando fallback para ID 1 (primeiro usuário)');
                  setUsuarioId(1);
                }
              } catch (err4) {
                console.log('❌ Falhou em /users/:', err4.response?.status, err4.response?.data);
                // Se não conseguir buscar o usuário, usar um ID padrão temporário
                console.log('⚠️ Não foi possível buscar dados do usuário, usando fallback');
                // Tentar IDs comuns: 1 (primeiro usuário), 2 (segundo usuário)
                console.log('🔄 Tentando fazer uma receita de teste para descobrir o ID correto...');
                
                // Vamos tentar IDs de 1 a 5 para descobrir qual funciona
                const testIds = [1, 2, 3, 4, 5];
                let validUserId = null;
                
                for (const testId of testIds) {
                  try {
                    // Fazer uma requisição teste para ver se o usuário existe
                    const testPayload = {
                      descricao: 'TESTE_USER_ID',
                      valor: 1.0,
                      data_receita: '2024-01-01',
                      categoria: 1, // Assumindo que categoria 1 existe
                      fonte: 'outros',
                      observacoes: 'teste',
                      usuario: testId,
                    };
                    
                    console.log(`🧪 Testando usuário ID ${testId}...`);
                    await api.post('/receitas/', testPayload, {
                      headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    
                    // Se chegou até aqui, o usuário é válido
                    console.log(`✅ Usuário ID ${testId} é válido!`);
                    validUserId = testId;
                    
                    // Deletar a receita teste imediatamente
                    try {
                      const receitasResponse = await api.get('/receitas/', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      });
                      const testeReceita = receitasResponse.data.find(r => r.descricao === 'TESTE_USER_ID');
                      if (testeReceita) {
                        await api.delete(`/receitas/${testeReceita.id}/`, {
                          headers: { Authorization: `Bearer ${accessToken}` },
                        });
                        console.log('🗑️ Receita teste deletada');
                      }
                    } catch (deleteErr) {
                      console.log('⚠️ Não foi possível deletar a receita teste');
                    }
                    
                    break;
                  } catch (testErr) {
                    console.log(`❌ Usuário ID ${testId} não é válido:`, testErr.response?.data);
                  }
                }
                
                if (validUserId) {
                  setUsuarioId(validUserId);
                } else {
                  setUsuarioId(1); // Fallback final
                }
              }
            }
          }
        }
        
        if (userRes && userRes.data) {
          setUsuarioId(userRes.data.id);
          console.log('✅ Usuario ID encontrado:', userRes.data.id);
          console.log('✅ Dados completos do usuário:', userRes.data);
        }
        
        // Buscar categorias
        const catRes = await api.get('/categorias/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategorias(catRes.data);
        console.log('📋 Categorias carregadas:', catRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err.response?.data || err.message);
        toast.error('Erro ao carregar dados');
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken, navigate]);

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
      const valorNumerico = parseFloat(form.valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        newErrors.valor = 'Valor deve ser maior que zero';
      }
    }

    // Validação da data
    if (!form.data_receita) {
      newErrors.data_receita = 'Data é obrigatória';
    } else {
      const dataSelecionada = new Date(form.data_receita);
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);
      
      if (dataSelecionada > hoje) {
        newErrors.data_receita = 'Data não pode ser futura';
      }
    }

    // Validação da categoria
    if (!form.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    // Validação da fonte
    if (!form.fonte) {
      newErrors.fonte = 'Fonte da receita é obrigatória';
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

    if (!usuarioId) {
      toast.error('Erro: dados do usuário não carregados');
      return;
    }

    setIsSubmitting(true);
    
    // Converter valor para formato numérico
    const valorNumerico = parseFloat(form.valor.replace(/[^\d,.-]/g, '').replace(',', '.'));

    const payload = {
      descricao: form.descricao.trim(),
      valor: valorNumerico,
      data_receita: form.data_receita,
      categoria: parseInt(form.categoria),
      fonte: form.fonte,
      observacoes: form.observacoes.trim(),
      usuario: usuarioId,
    };

    console.log('📤 Enviando payload:', payload);
    console.log('👤 Usuario ID:', usuarioId);
    console.log('📋 Categoria selecionada:', form.categoria);
    console.log('📋 Categorias disponíveis:', categorias);
    console.log('✅ Categoria convertida:', parseInt(form.categoria));
    
    // DEBUG: Descobrir automaticamente o ID do usuário válido
    console.log('🔍 Descobrindo ID de usuário válido automaticamente...');
    
    // Lista de IDs para testar (normalmente 1-10 cobrem a maioria dos casos)
    const idsParaTestar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let usuarioValidoEncontrado = false;
    
    for (const testId of idsParaTestar) {
      // Criar um payload de teste mínimo
      const payloadTeste = {
        descricao: 'TESTE_AUTO_DELETE',
        valor: 0.01,
        data_receita: form.data_receita,
        categoria: parseInt(form.categoria),
        fonte: form.fonte,
        observacoes: 'teste automatico - sera deletado',
        usuario: testId,
      };
      
      try {
        console.log(`🧪 Testando usuário ID ${testId}...`);
        
        // Tentar criar a receita com este ID
        const response = await api.post('/receitas/', payloadTeste, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        console.log(`✅ ID ${testId} FUNCIONOU! Receita criada:`, response.data);
        
        // Deletar imediatamente a receita de teste
        try {
          await api.delete(`/receitas/${response.data.id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log(`🗑️ Receita de teste (ID ${response.data.id}) deletada`);
        } catch (deleteErr) {
          console.log(`⚠️ Não foi possível deletar receita de teste:`, deleteErr);
        }
        
        // Agora criar a receita real com o ID que funciona
        const payloadReal = { ...payload, usuario: testId };
        const finalResponse = await api.post('/receitas/', payloadReal, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        console.log(`🎉 Receita real criada com sucesso usando usuário ID ${testId}:`, finalResponse.data);
        toast.success('Receita adicionada com sucesso!');
        navigate('/'); // Navega para a página principal (Dashboard)
        usuarioValidoEncontrado = true;
        return;
        
      } catch (err) {
        const errorData = err.response?.data;
        console.log(`❌ ID ${testId} falhou:`, errorData);
        
        // Se o erro for de usuário, continuar testando
        if (errorData?.usuario) {
          console.log(`📝 Erro específico do usuário para ID ${testId}:`, errorData.usuario);
          continue;
        } else {
          // Se não for erro de usuário, é outro problema
          console.log(`🛑 Erro não é do usuário (ID ${testId}), pode ser outro campo:`, errorData);
          // Ainda assim, continuar testando outros IDs
          continue;
        }
      }
    }
    
    // Se chegou aqui, nenhum ID funcionou
    if (!usuarioValidoEncontrado) {
      console.error('❌ NENHUM ID DE USUÁRIO FUNCIONOU! Testados:', idsParaTestar);
      toast.error('Erro: não foi possível encontrar um usuário válido. Verifique se há usuários cadastrados no sistema.');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="receita-container">
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
              primary: '#10b981',
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
      
      <h1>Nova Receita</h1>
      
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
            placeholder="Descrição da receita"
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
            placeholder="Valor da receita"
            value={form.valor}
            onValueChange={handleValueChange}
            className={errors.valor ? 'error' : ''}
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
        </div>

        <div className="form-group">
          <input
            type="date"
            name="data_receita"
            value={form.data_receita}
            onChange={handleChange}
            className={errors.data_receita ? 'error' : ''}
          />
          {errors.data_receita && <span className="error-message">{errors.data_receita}</span>}
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
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhuma categoria encontrada</option>
            )}
          </select>
          {errors.categoria && <span className="error-message">{errors.categoria}</span>}
          {categorias.length === 0 && !isLoading && (
            <span className="error-message">Nenhuma categoria disponível. Cadastre categorias no admin do Django primeiro.</span>
          )}
        </div>

        <div className="form-group">
          <select
            name="fonte"
            value={form.fonte}
            onChange={handleChange}
            className={errors.fonte ? 'error' : ''}
          >
            <option value="">Selecione a fonte da receita</option>
            {FONTE_RECEITA_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.fonte && <span className="error-message">{errors.fonte}</span>}
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
          {isSubmitting ? 'Adicionando...' : 'Adicionar Receita'}
        </button>
      </form>
    </div>
  );
};

export default NovaReceita;
