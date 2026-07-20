import { httpClient } from '../api/httpClient';
import type { User } from '../../application/store/useAuthStore';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },
};