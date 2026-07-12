// src/infrastructure/api/httpClient.ts
import axios from 'axios';

// En desarrollo apuntará a localhost:3000 (json-server), luego al de Spring Boot.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor para inyectar token de seguridad (JWT)
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});