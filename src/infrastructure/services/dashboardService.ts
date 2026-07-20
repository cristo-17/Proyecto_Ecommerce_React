import { httpClient } from '../api/httpClient';

export interface DashboardData {
  totalIngresos: number;
  totalEquipos: number;
  historialVentas: { mes: string; ventas: number }[];
  inventario: any[];
  cupones: any[];
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await httpClient.get<DashboardData>('/dashboard');
    return response.data;
  },
};