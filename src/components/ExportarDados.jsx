import React from 'react';
import './ExportarDados.css';

const ExportarDados = ({ 
  gastosFiltrados = [], 
  receitasFiltradas = [], 
  filtroAtivo = null 
}) => {
  // Função para converter dados para CSV
  const exportarCSV = () => {
    const csvContent = [];
    
    // Cabeçalho
    csvContent.push(['Tipo', 'Descrição', 'Valor', 'Data', 'Categoria/Fonte', 'Observações']);
    
    // Receitas
    receitasFiltradas.forEach(receita => {
      csvContent.push([
        'Receita',
        receita.descricao,
        receita.valor,
        receita.data_receita,
        receita.fonte,
        receita.observacoes || ''
      ]);
    });
    
    // Gastos
    gastosFiltrados.forEach(gasto => {
      csvContent.push([
        'Gasto',
        gasto.descricao,
        gasto.valor,
        gasto.data_gasto,
        gasto.categoria_nome || gasto.categoria,
        gasto.observacoes || ''
      ]);
    });
    
    // Converter para string CSV
    const csvString = csvContent.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Criar e baixar arquivo
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 
      `financas_${filtroAtivo ? filtroAtivo.periodo : 'todos'}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para gerar relatório em texto
  const exportarRelatorio = () => {
    const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
    const totalGastos = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
    const saldo = totalReceitas - totalGastos;
    
    const periodo = filtroAtivo ? filtroAtivo.nomeCompleto : 'Todos os períodos';
    
    const relatorio = `
RELATÓRIO FINANCEIRO - ${periodo}
=====================================================

RESUMO GERAL:
- Total de Receitas: R$ ${totalReceitas.toFixed(2)}
- Total de Gastos: R$ ${totalGastos.toFixed(2)}
- Saldo: R$ ${saldo.toFixed(2)}

RECEITAS (${receitasFiltradas.length}):
${receitasFiltradas.map(receita => 
  `- ${receita.descricao}: R$ ${parseFloat(receita.valor).toFixed(2)} (${receita.data_receita})`
).join('\n')}

GASTOS (${gastosFiltrados.length}):
${gastosFiltrados.map(gasto => 
  `- ${gasto.descricao}: R$ ${parseFloat(gasto.valor).toFixed(2)} (${gasto.data_gasto})`
).join('\n')}

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
    `;
    
    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 
      `relatorio_${filtroAtivo ? filtroAtivo.periodo : 'todos'}.txt`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para imprimir
  const imprimirRelatorio = () => {
    const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
    const totalGastos = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
    const saldo = totalReceitas - totalGastos;
    
    const periodo = filtroAtivo ? filtroAtivo.nomeCompleto : 'Todos os períodos';
    
    const conteudoImpressao = `
    <html>
      <head>
        <title>Relatório Financeiro - ${periodo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .resumo { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .secao { margin: 20px 0; }
          .item { margin: 5px 0; }
          .total { font-weight: bold; }
          .positivo { color: green; }
          .negativo { color: red; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Financeiro</h1>
          <h2>${periodo}</h2>
        </div>
        
        <div class="resumo">
          <h3>Resumo Geral</h3>
          <div class="item">Total de Receitas: <span class="total positivo">R$ ${totalReceitas.toFixed(2)}</span></div>
          <div class="item">Total de Gastos: <span class="total negativo">R$ ${totalGastos.toFixed(2)}</span></div>
          <div class="item">Saldo: <span class="total ${saldo >= 0 ? 'positivo' : 'negativo'}">R$ ${saldo.toFixed(2)}</span></div>
        </div>
        
        <div class="secao">
          <h3>Receitas (${receitasFiltradas.length})</h3>
          ${receitasFiltradas.map(receita => 
            `<div class="item">• ${receita.descricao}: R$ ${parseFloat(receita.valor).toFixed(2)} (${receita.data_receita})</div>`
          ).join('')}
        </div>
        
        <div class="secao">
          <h3>Gastos (${gastosFiltrados.length})</h3>
          ${gastosFiltrados.map(gasto => 
            `<div class="item">• ${gasto.descricao}: R$ ${parseFloat(gasto.valor).toFixed(2)} (${gasto.data_gasto})</div>`
          ).join('')}
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
        </div>
      </body>
    </html>
    `;
    
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(conteudoImpressao);
    janelaImpressao.document.close();
    janelaImpressao.print();
  };

  const temDados = gastosFiltrados.length > 0 || receitasFiltradas.length > 0;

  return (
    <div className="exportar-dados">
      <div className="exportar-header">
        <h4>📊 Exportar Dados</h4>
        {filtroAtivo && (
          <span className="periodo-exportar">
            {filtroAtivo.nomeCompleto}
          </span>
        )}
      </div>

      {temDados ? (
        <div className="exportar-botoes">
          <button 
            className="btn-exportar csv"
            onClick={exportarCSV}
            title="Exportar para Excel/CSV"
          >
            📈 CSV
          </button>
          
          <button 
            className="btn-exportar relatorio"
            onClick={exportarRelatorio}
            title="Exportar relatório detalhado"
          >
            📄 Relatório
          </button>
          
          <button 
            className="btn-exportar imprimir"
            onClick={imprimirRelatorio}
            title="Imprimir relatório"
          >
            🖨️ Imprimir
          </button>
        </div>
      ) : (
        <div className="sem-dados">
          <p>Nenhum dado disponível para exportar</p>
        </div>
      )}
    </div>
  );
};

export default ExportarDados;
