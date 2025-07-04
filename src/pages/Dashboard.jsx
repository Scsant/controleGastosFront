import { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useExpenses from '../hooks/useExpenses';
import useReceitas from '../hooks/useReceitas';
import { Link } from 'react-router-dom';
import FiltrosMensais from '../components/FiltrosMensais';
import EstatisticasMensais from '../components/EstatisticasMensais';
import ResumoUltimosMeses from '../components/ResumoUltimosMeses';
import ExportarDados from '../components/ExportarDados';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario, accessToken } = useContext(AuthContext);
  const { gastos, loading: loadingGastos } = useExpenses(accessToken);
  const { receitas, loading: loadingReceitas } = useReceitas(accessToken);
  const [filtroMensal, setFiltroMensal] = useState(null);

  console.log('🔍 Dashboard renderizando...');
  console.log('👤 Usuário:', usuario);
  console.log('🔑 Token:', accessToken ? 'Presente' : 'Ausente');
  console.log('💰 Gastos:', gastos.length);
  console.log('💸 Receitas:', receitas.length);

  // Filtrar dados baseado no período selecionado
  const { gastosFiltrados, receitasFiltradas } = useMemo(() => {
    let dadosFiltrados = { gastosFiltrados: gastos, receitasFiltradas: receitas };

    // Filtro por período
    if (filtroMensal) {
      const filtrarPorPeriodo = (items, campoData) => {
        return items.filter(item => {
          const dataItem = new Date(item[campoData]);
          const anoItem = dataItem.getFullYear();
          const mesItem = String(dataItem.getMonth() + 1).padStart(2, '0');
          const periodoItem = `${anoItem}-${mesItem}`;
          return periodoItem === filtroMensal.periodo;
        });
      };

      dadosFiltrados = {
        gastosFiltrados: filtrarPorPeriodo(gastos, 'data_gasto'),
        receitasFiltradas: filtrarPorPeriodo(receitas, 'data_receita')
      };
    }

    return dadosFiltrados;
  }, [gastos, receitas, filtroMensal]);

  // Calcular totais dos dados filtrados
  const totalGastos = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
  const saldo = totalReceitas - totalGastos;

  const handleFiltroMensalChange = (filtro) => {
    setFiltroMensal(filtro);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Bem-vindo, {usuario?.username}!</h1>
          <p className="dashboard-subtitle">
            {filtroMensal 
              ? `Visualizando seus dados de ${filtroMensal.nomeCompleto}`
              : 'Seu painel de controle financeiro pessoal'}
          </p>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <FiltrosMensais onFilterChange={handleFiltroMensalChange} />
        </div>

        {/* Resumo dos Últimos Meses - só mostra se há dados */}
        {(gastos.length > 0 || receitas.length > 0) && (
          <ResumoUltimosMeses gastos={gastos} receitas={receitas} />
        )}

        {/* Estatísticas Mensais - só mostra se há dados */}
        {(gastosFiltrados.length > 0 || receitasFiltradas.length > 0) && (
          <EstatisticasMensais 
            gastosFiltrados={gastosFiltrados}
            receitasFiltradas={receitasFiltradas}
            filtroAtivo={filtroMensal}
            filtroUsuario={null}
          />
        )}

        {/* Exportar Dados - só mostra se há dados */}
        {(gastosFiltrados.length > 0 || receitasFiltradas.length > 0) && (
          <ExportarDados 
            gastosFiltrados={gastosFiltrados}
            receitasFiltradas={receitasFiltradas}
            filtroAtivo={filtroMensal}
          />
        )}

        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Resumo Financeiro</h2>
          <div className="action-buttons">
            <Link to="/nova-receita" className="add-income-btn">
              + Nova Receita
            </Link>
            <Link to="/novo-gasto" className="add-expense-btn">
              + Novo Gasto
            </Link>
          </div>
        </div>

        <div className="financial-summary">
          <div className="summary-card income">
            <h3>Receitas</h3>
            <span className="amount">R$ {totalReceitas.toFixed(2)}</span>
            <span className="period-info">
              {filtroMensal ? filtroMensal.nomeCompleto : 'Total geral'}
            </span>
          </div>
          <div className="summary-card expense">
            <h3>Gastos</h3>
            <span className="amount">R$ {totalGastos.toFixed(2)}</span>
            <span className="period-info">
              {filtroMensal ? filtroMensal.nomeCompleto : 'Total geral'}
            </span>
          </div>
          <div className={`summary-card balance ${saldo >= 0 ? 'positive' : 'negative'}`}>
            <h3>Saldo</h3>
            <span className="amount">R$ {saldo.toFixed(2)}</span>
            <span className="period-info">
              {filtroMensal ? filtroMensal.nomeCompleto : 'Total geral'}
            </span>
          </div>
        </div>

        {/* Seção de Ajuda - aparece quando não há dados */}
        {gastos.length === 0 && receitas.length === 0 && (
          <div className="help-section">
            <h3>🚀 Comece agora!</h3>
            <p>Para começar a usar seu controle financeiro:</p>
            <ul>
              <li>➕ Adicione suas primeiras receitas e gastos</li>
              <li>📊 Use os filtros mensais para analisar períodos específicos</li>
              <li>📈 Acompanhe suas estatísticas financeiras</li>
              <li>📁 Exporte seus dados quando necessário</li>
            </ul>
          </div>
        )}

        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            {filtroMensal 
              ? `Receitas de ${filtroMensal.nomeCompleto}`
              : 'Últimas Receitas'}
          </h2>
        </div>

        {loadingReceitas ? (
          <p className="loading-message">Carregando receitas...</p>
        ) : (
          <ul className="transactions-list">
            {receitasFiltradas.slice(0, filtroMensal ? receitasFiltradas.length : 5).map((receita) => (
              <li key={`receita-${receita.id}`} className="transaction-item income">
                <div className="transaction-description">
                  {receita.descricao}
                </div>
                <div className="transaction-details">
                  <span className="transaction-value">+ R$ {parseFloat(receita.valor).toFixed(2)}</span>
                  <span className="transaction-date">{receita.data_receita}</span>
                  <span className="transaction-source">{receita.fonte}</span>
                </div>
              </li>
            ))}
            {receitasFiltradas.length === 0 && (
              <li className="no-transactions">
                {filtroMensal 
                  ? `Nenhuma receita encontrada para ${filtroMensal.nomeCompleto}`
                  : 'Nenhuma receita encontrada. Comece adicionando suas primeiras receitas!'}
              </li>
            )}
          </ul>
        )}

        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            {filtroMensal 
              ? `Gastos de ${filtroMensal.nomeCompleto}`
              : 'Últimos Gastos'}
          </h2>
        </div>

        {loadingGastos ? (
          <p className="loading-message">Carregando gastos...</p>
        ) : (
          <ul className="transactions-list">
            {gastosFiltrados.slice(0, filtroMensal ? gastosFiltrados.length : 5).map((gasto) => (
              <li key={`gasto-${gasto.id}`} className="transaction-item expense">
                <div className="transaction-description">
                  {gasto.descricao}
                </div>
                <div className="transaction-details">
                  <span className="transaction-value">- R$ {parseFloat(gasto.valor).toFixed(2)}</span>
                  <span className="transaction-date">{gasto.data_gasto}</span>
                  <span className="transaction-category">{gasto.categoria_nome}</span>
                </div>
              </li>
            ))}
            {gastosFiltrados.length === 0 && (
              <li className="no-transactions">
                {filtroMensal 
                  ? `Nenhum gasto encontrado para ${filtroMensal.nomeCompleto}`
                  : 'Nenhum gasto encontrado. Comece adicionando seus primeiros gastos!'}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
