import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { usuario } = useContext(AuthContext);
  if (!usuario) {
    return <Navigate to="/" replace />;
  }
  return children;
}
