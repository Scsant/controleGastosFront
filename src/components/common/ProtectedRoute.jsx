import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const authContext = useContext(AuthContext);
  
  // Verificar se o contexto está disponível
  if (!authContext) {
    return <div>Carregando...</div>;
  }
  
  const { usuario } = authContext;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
