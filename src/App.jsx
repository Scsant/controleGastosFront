import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NovoGasto from './pages/NovoGasto';
import NovaReceita from './pages/NovaReceita';
import TestUsuarios from './components/TestUsuarios';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novo-gasto"
            element={
              <ProtectedRoute>
                <NovoGasto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nova-receita"
            element={
              <ProtectedRoute>
                <NovaReceita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-usuarios"
            element={
              <ProtectedRoute>
                <TestUsuarios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

