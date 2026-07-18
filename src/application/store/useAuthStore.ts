// src/application/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// 1. Interfaces y Tipos (Dominio)
// ==========================================
export type RolUsuario = "ADMIN" | "PROVEEDOR" | "CLIENTE";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (user: User, token: string) => void;
  logout: () => void;
}

// ==========================================
// 2 & 3. Lógica de Negocio y Estado Global
// ==========================================
export const useAuthStore = create<AuthState>()(
  // 4. Persistencia
  persist(
    (set) => ({
      // Estado Inicial
      user: null,
      token: null,
      isAuthenticated: false,

      // Acción de Inicio de Sesión
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Acción de Cierre de Sesión
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // TO-DO: Invocar limpieza del estado del carrito. 
        // Alternativamente, forzamos el borrado del carrito en persistencia 
        // para garantizar que la sesión quede completamente limpia.
        localStorage.removeItem("app-celulares-cart");
      },
    }),
    {
      name: "app-celulares-auth", // Llave de persistencia en localStorage
    }
  )
);