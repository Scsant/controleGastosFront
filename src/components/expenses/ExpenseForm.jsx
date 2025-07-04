import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ExpenseForm({ onGastoAdicionado }) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data_gasto: '',
    categoria: '',
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get('/api/categorias/').then((res) => setCategorias(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/gastos/', form)
      .then(() => {
        alert('Gasto adicionado!');
        setForm({ descricao: '', valor: '', data_gasto: '', categoria: '' });
        onGastoAdicionado(); // Atualiza lista
      })
      .catch((err) => alert('Erro ao salvar gasto'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Gasto</h3>
      <input
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={handleChange}
        required
      />
      <input
        name="valor"
        placeholder="Valor"
        type="number"
        value={form.valor}
        onChange={handleChange}
        required
      />
      <input
        name="data_gasto"
        placeholder="Data"
        type="date"
        value={form.data_gasto}
        onChange={handleChange}
        required
      />
      <select name="categoria" value={form.categoria} onChange={handleChange} required>
        <option value="">Selecione uma categoria</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>
      <button type="submit">Salvar</button>
    </form>
  );
}
