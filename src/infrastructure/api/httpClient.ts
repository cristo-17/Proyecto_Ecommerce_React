// src/infrastructure/api/httpClient.ts
import axios from "axios";
import { useAuthStore } from "../../application/store/useAuthStore";

// ==========================================
// 1. Instancia Base
// ==========================================
export const httpClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// 2. Interceptor de Peticiones (Request)
// ==========================================
httpClient.interceptors.request.use(
  (config) => {
    // Extraemos el token del store leyendo el estado directamente
    // (Esto evita romper las reglas de los hooks de React)
    const { token } = useAuthStore.getState();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// 3. Interceptor de Respuestas (Response)
// ==========================================
httpClient.interceptors.response.use(
  (response) => {
    // Petición exitosa, pasamos la respuesta intacta
    return response;
  },
  (error) => {
    // Validación 401: Token expirado, inválido o ausente
    if (error.response?.status === 401) {
      // Limpiamos la sesión en el estado global
      useAuthStore.getState().logout();
      
      // Redirección forzada de seguridad hacia el inicio de sesión
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);