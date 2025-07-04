import React from 'react';
import './EstatisticasMensais.css';

const EstatisticasMensais = ({ 
  gastosFiltrados, 
  receitasFiltradas, 
  filtroAtivo,
  filtroUsuario,
  categoriasGastos = []
}) => {
  // Calcular totais
  const totalGastos = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
  const saldo = totalReceitas - totalGastos;

  // Agrupar gastos por categoria
  const gastosPorCategoria = gastosFiltrados.reduce((acc, gasto) => {
    const categoria = gasto.categoria_nome || 'Sem categoria';
    if (!acc[categoria]) {
      acc[categoria] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    acc[categoria].total += parseFloat(gasto.valor);
    acc[categoria].count += 1;
    acc[categoria].items.push(gasto);
    return acc;
  }, {});

  // Agrupar receitas por fonte
  const receitasPorFonte = receitasFiltradas.reduce((acc, receita) => {
    const fonte = receita.fonte || 'Outros';
    if (!acc[fonte]) {
      acc[fonte] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    acc[fonte].total += parseFloat(receita.valor);
    acc[fonte].count += 1;
    acc[fonte].items.push(receita);
    return acc;
  }, {});

  // Agrupar por usuário se não houver filtro de usuário específico
  const gastosPorUsuario = !filtroUsuario ? gastosFiltrados.reduce((acc, gasto) => {
    const usuarioNome = gasto.usuario_nome || `Usuário ${gasto.usuario || gasto.usuario_id}`;
    if (!acc[usuarioNome]) {
      acc[usuarioNome] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    acc[usuarioNome].total += parseFloat(gasto.valor);
    acc[usuarioNome].count += 1;
    acc[usuarioNome].items.push(gasto);
    return acc;
  }, {}) : {};

  const receitasPorUsuario = !filtroUsuario ? receitasFiltradas.reduce((acc, receita) => {
    const usuarioNome = receita.usuario_nome || `Usuário ${receita.usuario || receita.usuario_id}`;
    if (!acc[usuarioNome]) {
      acc[usuarioNome] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    acc[usuarioNome].total += parseFloat(receita.valor);
    acc[usuarioNome].count += 1;
    acc[usuarioNome].items.push(receita);
    return acc;
  }, {}) : {};

  // Ordenar por valor
  const categoriasOrdenadas = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1].total - a[1].total);
  
  const fontesOrdenadas = Object.entries(receitasPorFonte)
    .sort((a, b) => b[1].total - a[1].total);

  const usuariosGastosOrdenados = Object.entries(gastosPorUsuario)
    .sort((a, b) => b[1].total - a[1].total);

  const usuariosReceitasOrdenados = Object.entries(receitasPorUsuario)
    .sort((a, b) => b[1].total - a[1].total);

  // Calcular percentuais
  const calcularPercentual = (valor, total) => {
    if (total === 0) return 0;
    return ((valor / total) * 100).toFixed(1);
  };

  return (
    <div className="estatisticas-mensais">
      <div className="estatisticas-header">
        <h3>📊 Análise Detalhada</h3>
        {(filtroAtivo || filtroUsuario) && (
          <span className="periodo-badge">
            {filtroAtivo && filtroUsuario 
              ? `${filtroUsuario.usuarioNome} - ${filtroAtivo.nomeCompleto}`
              : filtroAtivo 
                ? filtroAtivo.nomeCompleto
                : filtroUsuario.usuarioNome}
          </span>
        )}
      </div>

      {/* Resumo Geral */}
      <div className="resumo-geral">
        <div className="resumo-card receitas">
          <div className="resumo-icon">💰</div>
          <div className="resumo-dados">
            <h4>Receitas</h4>
            <span className="valor">R$ {totalReceitas.toFixed(2)}</span>
            <span className="contador">{receitasFiltradas.length} entradas</span>
          </div>
        </div>

        <div className="resumo-card gastos">
          <div className="resumo-icon">💸</div>
          <div className="resumo-dados">
            <h4>Gastos</h4>
            <span className="valor">R$ {totalGastos.toFixed(2)}</span>
            <span className="contador">{gastosFiltrados.length} entradas</span>
          </div>
        </div>

        <div className={`resumo-card saldo ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
          <div className="resumo-icon">{saldo >= 0 ? '📈' : '📉'}</div>
          <div className="resumo-dados">
            <h4>Saldo</h4>
            <span className="valor">R$ {saldo.toFixed(2)}</span>
            <span className="contador">
              {saldo >= 0 ? 'Superávit' : 'Déficit'}
            </span>
          </div>
        </div>
      </div>

      {/* Análise por Usuário (apenas se não houver filtro de usuário específico) */}
      {!filtroUsuario && (usuariosGastosOrdenados.length > 0 || usuariosReceitasOrdenados.length > 0) && (
        <div className="analise-usuarios">
          <h4>👥 Resumo por Pessoa da Família</h4>
          
          {usuariosGastosOrdenados.length > 0 && (
            <div className="usuarios-secao">
              <h5>💸 Gastos por Pessoa</h5>
              <div className="usuarios-lista">
                {usuariosGastosOrdenados.map(([usuario, dados]) => (
                  <div key={`gastos-${usuario}`} className="usuario-item gastos">
                    <div className="usuario-info">
                      <span className="usuario-nome">{usuario}</span>
                      <span className="usuario-count">{dados.count} gastos</span>
                    </div>
                    <div className="usuario-valores">
                      <span className="usuario-valor">R$ {dados.total.toFixed(2)}</span>
                      <span className="usuario-percentual">
                        {calcularPercentual(dados.total, totalGastos)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {usuariosReceitasOrdenados.length > 0 && (
            <div className="usuarios-secao">
              <h5>💰 Receitas por Pessoa</h5>
              <div className="usuarios-lista">
                {usuariosReceitasOrdenados.map(([usuario, dados]) => (
                  <div key={`receitas-${usuario}`} className="usuario-item receitas">
                    <div className="usuario-info">
                      <span className="usuario-nome">{usuario}</span>
                      <span className="usuario-count">{dados.count} receitas</span>
                    </div>
                    <div className="usuario-valores">
                      <span className="usuario-valor">R$ {dados.total.toFixed(2)}</span>
                      <span className="usuario-percentual">
                        {calcularPercentual(dados.total, totalReceitas)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Análise por Categoria */}
      {categoriasOrdenadas.length > 0 && (
        <div className="analise-categorias">
          <h4>💳 Gastos por Categoria</h4>
          <div className="categorias-lista">
            {categoriasOrdenadas.map(([categoria, dados]) => (
              <div key={categoria} className="categoria-item">
                <div className="categoria-info">
                  <span className="categoria-nome">{categoria}</span>
                  <span className="categoria-count">{dados.count} gastos</span>
                </div>
                <div className="categoria-valores">
                  <span className="categoria-valor">R$ {dados.total.toFixed(2)}</span>
                  <span className="categoria-percentual">
                    {calcularPercentual(dados.total, totalGastos)}%
                  </span>
                </div>
                <div className="categoria-barra">
                  <div 
                    className="categoria-progresso"
                    style={{ width: `${calcularPercentual(dados.total, totalGastos)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análise por Fonte de Receita */}
      {fontesOrdenadas.length > 0 && (
        <div className="analise-fontes">
          <h4>💼 Receitas por Fonte</h4>
          <div className="fontes-lista">
            {fontesOrdenadas.map(([fonte, dados]) => (
              <div key={fonte} className="fonte-item">
                <div className="fonte-info">
                  <span className="fonte-nome">{fonte}</span>
                  <span className="fonte-count">{dados.count} receitas</span>
                </div>
                <div className="fonte-valores">
                  <span className="fonte-valor">R$ {dados.total.toFixed(2)}</span>
                  <span className="fonte-percentual">
                    {calcularPercentual(dados.total, totalReceitas)}%
                  </span>
                </div>
                <div className="fonte-barra">
                  <div 
                    className="fonte-progresso"
                    style={{ width: `${calcularPercentual(dados.total, totalReceitas)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicadores */}
      <div className="indicadores">
        <div className="indicador">
          <span className="indicador-label">Taxa de Poupança</span>
          <span className={`indicador-valor ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
            {totalReceitas > 0 ? calcularPercentual(saldo, totalReceitas) : 0}%
          </span>
        </div>
        
        <div className="indicador">
          <span className="indicador-label">Gasto Médio</span>
          <span className="indicador-valor">
            R$ {gastosFiltrados.length > 0 ? (totalGastos / gastosFiltrados.length).toFixed(2) : '0.00'}
          </span>
        </div>
        
        <div className="indicador">
          <span className="indicador-label">Receita Média</span>
          <span className="indicador-valor">
            R$ {receitasFiltradas.length > 0 ? (totalReceitas / receitasFiltradas.length).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasMensais;
