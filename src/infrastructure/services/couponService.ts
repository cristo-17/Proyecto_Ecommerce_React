import { httpClient } from '../api/httpClient';

export interface Cupon {
  id: string;
  codigo: string;
  descuento: number;
  fechaCaducidad: string;
  usos: number;
  limite: number;
  estado: string;
}

export const couponService = {
  async getAll(): Promise<Cupon[]> {
    const response = await httpClient.get<Cupon[]>('/cupones');
    return response.data;
  },

  async create(data: { codigo: string; descuento: number; fechaCaducidad: string; limite: number }): Promise<Cupon> {
    const response = await httpClient.post<Cupon>('/cupones', data);
    return response.data;
  },
};