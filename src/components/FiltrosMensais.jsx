import React, { useState, useEffect, useMemo } from 'react';
import './FiltrosMensais.css';

const FiltrosMensais = ({ onFilterChange }) => {
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [anoSelecionado, setAnoSelecionado] = useState('');

  // Gerar opções de mês - memoizar para evitar recriações
  const meses = useMemo(() => [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ], []);

  // Gerar opções de ano - memoizar para evitar recriações
  const anos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anosArray = [];
    for (let i = anoAtual - 3; i <= anoAtual + 1; i++) {
      anosArray.push(i);
    }
    return anosArray;
  }, []);

  // Não inicializar automaticamente - deixar usuário escolher
  // useEffect(() => {
  //   const agora = new Date();
  //   const mesAtual = String(agora.getMonth() + 1).padStart(2, '0');
  //   const anoAtual = String(agora.getFullYear());
  //   
  //   setMesSelecionado(mesAtual);
  //   setAnoSelecionado(anoAtual);
  // }, []);

  // Notificar mudanças - remover onFilterChange das dependências para evitar loop infinito
  useEffect(() => {
    if (mesSelecionado && anoSelecionado) {
      onFilterChange({
        mes: mesSelecionado,
        ano: anoSelecionado,
        periodo: `${anoSelecionado}-${mesSelecionado}`,
        nomeCompleto: `${meses.find(m => m.value === mesSelecionado)?.label} de ${anoSelecionado}`
      });
    } else if (!mesSelecionado && !anoSelecionado) {
      // Se ambos os filtros foram limpos, notificar que não há filtro
      onFilterChange(null);
    }
  }, [mesSelecionado, anoSelecionado, meses]);

  const handleMesChange = (e) => {
    setMesSelecionado(e.target.value);
  };

  const handleAnoChange = (e) => {
    setAnoSelecionado(e.target.value);
  };

  const limparFiltros = () => {
    setMesSelecionado('');
    setAnoSelecionado('');
    onFilterChange(null);
  };

  const irParaMesAnterior = () => {
    if (mesSelecionado && anoSelecionado) {
      let novoMes = parseInt(mesSelecionado) - 1;
      let novoAno = parseInt(anoSelecionado);
      
      if (novoMes === 0) {
        novoMes = 12;
        novoAno -= 1;
      }
      
      setMesSelecionado(String(novoMes).padStart(2, '0'));
      setAnoSelecionado(String(novoAno));
    }
  };

  const irParaProximoMes = () => {
    if (mesSelecionado && anoSelecionado) {
      let novoMes = parseInt(mesSelecionado) + 1;
      let novoAno = parseInt(anoSelecionado);
      
      if (novoMes === 13) {
        novoMes = 1;
        novoAno += 1;
      }
      
      setMesSelecionado(String(novoMes).padStart(2, '0'));
      setAnoSelecionado(String(novoAno));
    }
  };

  return (
    <div className="filtros-mensais">
      <div className="filtros-header">
        <h3>📅 Filtros Mensais</h3>
        <button 
          className="btn-limpar-filtros"
          onClick={limparFiltros}
          title="Ver todos os registros"
        >
          🗑️ Limpar
        </button>
      </div>

      <div className="filtros-controles">
        <div className="navegacao-mes">
          <button 
            className="btn-mes-anterior"
            onClick={irParaMesAnterior}
            title="Mês anterior"
          >
            ‹
          </button>
          
          <div className="selecoes-periodo">
            <select 
              value={mesSelecionado} 
              onChange={handleMesChange}
              className="select-mes"
            >
              <option value="">Mês</option>
              {meses.map(mes => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </select>

            <select 
              value={anoSelecionado} 
              onChange={handleAnoChange}
              className="select-ano"
            >
              <option value="">Ano</option>
              {anos.map(ano => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn-proximo-mes"
            onClick={irParaProximoMes}
            title="Próximo mês"
          >
            ›
          </button>
        </div>
      </div>

      {mesSelecionado && anoSelecionado && (
        <div className="periodo-selecionado">
          📊 Visualizando: <strong>
            {meses.find(m => m.value === mesSelecionado)?.label} de {anoSelecionado}
          </strong>
        </div>
      )}
    </div>
  );
};

export default FiltrosMensais;
