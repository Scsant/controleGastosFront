import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    login(form.username, form.password);
  };

  return (
    <div className="login-page-wrapper">
      <img className="decorative-ellipse ellipse-2" src="/familia3.jpeg" alt="decorativa 1" />
      <img className="decorative-ellipse ellipse-3" src="/familia.jpeg" alt="decorativa 2" />

      <div className="login-card-container">
        <div className="login-card">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
              <FaUser className="input-icon" />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <FaLock className="input-icon" />
            </div>
            <button type="submit" className="submit-button">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
}
