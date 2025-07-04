import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useExpenses from '../hooks/useExpenses';
import useReceitas from '../hooks/useReceitas';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario, accessToken } = useContext(AuthContext);
  const { gastos, loading: loadingGastos } = useExpenses(accessToken);
  const { receitas, loading: loadingReceitas } = useReceitas(accessToken);

  const totalGastos = gastos.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
  const totalReceitas = receitas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
  const saldo = totalReceitas - totalGastos;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Bem-vindo, {usuario?.username}!</h1>
          <p className="dashboard-subtitle">Seu painel de controle financeiro familiar.</p>
        </div>

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
          </div>
          <div className="summary-card expense">
            <h3>Gastos</h3>
            <span className="amount">R$ {totalGastos.toFixed(2)}</span>
          </div>
          <div className={`summary-card balance ${saldo >= 0 ? 'positive' : 'negative'}`}>
            <h3>Saldo</h3>
            <span className="amount">R$ {saldo.toFixed(2)}</span>
          </div>
        </div>

        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Últimas Receitas</h2>
        </div>

        {loadingReceitas ? (
          <p className="loading-message">Carregando receitas...</p>
        ) : (
          <ul className="transactions-list">
            {receitas.slice(0, 3).map((receita) => (
              <li key={`receita-${receita.id}`} className="transaction-item income">
                <div className="transaction-description">{receita.descricao}</div>
                <div className="transaction-details">
                  <span className="transaction-value">+ R$ {parseFloat(receita.valor).toFixed(2)}</span>
                  <span className="transaction-date">{receita.data_receita}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Últimos Gastos</h2>
        </div>

        {loadingGastos ? (
          <p className="loading-message">Carregando gastos...</p>
        ) : (
          <ul className="transactions-list">
            {gastos.slice(0, 3).map((gasto) => (
              <li key={`gasto-${gasto.id}`} className="transaction-item expense">
                <div className="transaction-description">{gasto.descricao}</div>
                <div className="transaction-details">
                  <span className="transaction-value">- R$ {parseFloat(gasto.valor).toFixed(2)}</span>
                  <span className="transaction-date">{gasto.data_gasto}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
