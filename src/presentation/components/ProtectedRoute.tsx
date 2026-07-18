// src/presentation/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../application/store/useAuthStore";
import type { RolUsuario } from "../../domain/models/appCelulares.model";

interface ProtectedRouteProps {
  allowedRoles?: RolUsuario[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // 1. Consumo del Estado Global (Zustand)
  const { isAuthenticated, user } = useAuthStore();

  // 2. Validación 1 (Autenticación): Si no hay sesión activa, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Validación 2 (Autorización): Si la ruta requiere roles específicos y el usuario no los tiene
  if (allowedRoles && user && !allowedRoles.includes(user.rol as RolUsuario)) {
    return <Navigate to="/" replace />;
  }

  // 4. Pase Libre: Usuario autenticado y con los permisos correctos
  return <Outlet />;
};
