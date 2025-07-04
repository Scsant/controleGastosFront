import React from 'react';
import './ResumoUltimosMeses.css';

const ResumoUltimosMeses = ({ 
  gastos = [], 
  receitas = [], 
  quantidadeMeses = 6 
}) => {
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

  // Gerar resumo dos últimos meses
  const resumoMeses = [];
  const dataAtual = new Date();
  
  for (let i = quantidadeMeses - 1; i >= 0; i--) {
    const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;
    
    const dadosPeriodo = obterDadosPeriodo(ano, mes);
    
    resumoMeses.push({
      ano,
      mes,
      nomeCompleto: `${data.toLocaleDateString('pt-BR', { month: 'long' })} de ${ano}`,
      nomeAbreviado: `${data.toLocaleDateString('pt-BR', { month: 'short' })}/${ano}`,
      ...dadosPeriodo
    });
  }

  // Encontrar valores máximos para normalizar as barras
  const maxReceitas = Math.max(...resumoMeses.map(m => m.totalReceitas));
  const maxGastos = Math.max(...resumoMeses.map(m => m.totalGastos));
  const maxValor = Math.max(maxReceitas, maxGastos);

  return (
    <div className="resumo-ultimos-meses">
      <div className="resumo-header">
        <h3>📈 Evolução dos Últimos {quantidadeMeses} Meses</h3>
      </div>

      <div className="meses-grid">
        {resumoMeses.map(({ ano, mes, nomeAbreviado, totalReceitas, totalGastos, saldo }) => (
          <div key={`${ano}-${mes}`} className="mes-card">
            <div className="mes-nome">{nomeAbreviado}</div>
            
            <div className="mes-barras">
              <div className="barra-container">
                <div 
                  className="barra receitas"
                  style={{ 
                    height: maxValor > 0 ? `${(totalReceitas / maxValor) * 100}%` : '0%',
                    minHeight: totalReceitas > 0 ? '10px' : '0px'
                  }}
                  title={`Receitas: R$ ${totalReceitas.toFixed(2)}`}
                ></div>
                
                <div 
                  className="barra gastos"
                  style={{ 
                    height: maxValor > 0 ? `${(totalGastos / maxValor) * 100}%` : '0%',
                    minHeight: totalGastos > 0 ? '10px' : '0px'
                  }}
                  title={`Gastos: R$ ${totalGastos.toFixed(2)}`}
                ></div>
              </div>
            </div>

            <div className="mes-valores">
              <div className="mes-receitas">
                <span className="valor-label">R$</span>
                <span className="valor-numero">{totalReceitas.toFixed(0)}</span>
              </div>
              
              <div className="mes-gastos">
                <span className="valor-label">R$</span>
                <span className="valor-numero">{totalGastos.toFixed(0)}</span>
              </div>
              
              <div className={`mes-saldo ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
                <span className="saldo-icon">{saldo >= 0 ? '↗' : '↘'}</span>
                <span className="saldo-valor">R$ {Math.abs(saldo).toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="resumo-legenda">
        <div className="legenda-item">
          <div className="legenda-cor receitas"></div>
          <span>Receitas</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-cor gastos"></div>
          <span>Gastos</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-cor saldo"></div>
          <span>Saldo</span>
        </div>
      </div>
    </div>
  );
};

export default ResumoUltimosMeses;
