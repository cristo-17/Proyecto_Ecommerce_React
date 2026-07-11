// src/presentation/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { RolUsuario } from '../../domain/models/appCelulares.model';

interface ProtectedRouteProps {
  allowedRoles?: RolUsuario[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // Simulación: En la arquitectura final estos datos vendrán de Zustand o Context
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role') as RolUsuario | null;

  // 1. Si no hay token, enviar al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta exige roles específicos y el usuario no cuenta con ellos, denegar
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Opcional: Redirigir a una vista de "No Autorizado"
  }

  // 3. Usuario autenticado y autorizado
  return <Outlet />;
};