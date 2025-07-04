import { useState, useMemo } from 'react';

/**
 * Hook para gerenciar filtros mensais
 * @param {Array} gastos - Array de gastos
 * @param {Array} receitas - Array de receitas
 * @returns {Object} - Objeto com dados filtrados e funções de controle
 */
const useFiltrosMensais = (gastos = [], receitas = []) => {
  const [filtroMensal, setFiltroMensal] = useState(null);

  // Filtrar dados baseado no período selecionado
  const dadosFiltrados = useMemo(() => {
    if (!filtroMensal) {
      return { gastosFiltrados: gastos, receitasFiltradas: receitas };
    }

    const filtrarPorPeriodo = (items, campoData) => {
      return items.filter(item => {
        const dataItem = new Date(item[campoData]);
        const anoItem = dataItem.getFullYear();
        const mesItem = String(dataItem.getMonth() + 1).padStart(2, '0');
        const periodoItem = `${anoItem}-${mesItem}`;
        return periodoItem === filtroMensal.periodo;
      });
    };

    return {
      gastosFiltrados: filtrarPorPeriodo(gastos, 'data_gasto'),
      receitasFiltradas: filtrarPorPeriodo(receitas, 'data_receita')
    };
  }, [gastos, receitas, filtroMensal]);

  // Calcular totais
  const totais = useMemo(() => {
    const totalGastos = dadosFiltrados.gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
    const totalReceitas = dadosFiltrados.receitasFiltradas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
    const saldo = totalReceitas - totalGastos;

    return { totalGastos, totalReceitas, saldo };
  }, [dadosFiltrados]);

  // Função para alterar filtro
  const handleFiltroChange = (filtro) => {
    setFiltroMensal(filtro);
  };

  // Função para limpar filtro
  const limparFiltro = () => {
    setFiltroMensal(null);
  };

  // Função para obter dados de um período específico
  const obterDadosPeriodo = (ano, mes) => {
    const periodo = `${ano}-${String(mes).padStart(2, '0')}`;
    
    const gastosPeriodo = gastos.filter(gasto => {
      const dataGasto = new Date(gasto.data_gasto);
      const anoGasto = dataGasto.getFullYear();
      const mesGasto = String(dataGasto.getMonth() + 1).padStart(2, '0');
      return `${anoGasto}-${mesGasto}` === periodo;
    });

    const receitasPeriodo = receitas.filter(receita => {
      const dataReceita = new Date(receita.data_receita);
      const anoReceita = dataReceita.getFullYear();
      const mesReceita = String(dataReceita.getMonth() + 1).padStart(2, '0');
      return `${anoReceita}-${mesReceita}` === periodo;
    });

    const totalGastosPeriodo = gastosPeriodo.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
    const totalReceitasPeriodo = receitasPeriodo.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
    const saldoPeriodo = totalReceitasPeriodo - totalGastosPeriodo;

    return {
      gastos: gastosPeriodo,
      receitas: receitasPeriodo,
      totalGastos: totalGastosPeriodo,
      totalReceitas: totalReceitasPeriodo,
      saldo: saldoPeriodo
    };
  };

  // Função para obter resumo dos últimos meses
  const obterResumoUltimosMeses = (quantidadeMeses = 6) => {
    const resumo = [];
    const dataAtual = new Date();
    
    for (let i = 0; i < quantidadeMeses; i++) {
      const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      
      const dadosPeriodo = obterDadosPeriodo(ano, mes);
      
      resumo.push({
        ano,
        mes,
        nomeCompleto: `${data.toLocaleDateString('pt-BR', { month: 'long' })} de ${ano}`,
        ...dadosPeriodo
      });
    }
    
    return resumo.reverse(); // Ordem cronológica
  };

  return {
    filtroMensal,
    gastosFiltrados: dadosFiltrados.gastosFiltrados,
    receitasFiltradas: dadosFiltrados.receitasFiltradas,
    totalGastos: totais.totalGastos,
    totalReceitas: totais.totalReceitas,
    saldo: totais.saldo,
    handleFiltroChange,
    limparFiltro,
    obterDadosPeriodo,
    obterResumoUltimosMeses
  };
};

export default useFiltrosMensais;
