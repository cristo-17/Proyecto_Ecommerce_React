import { httpClient } from '../api/httpClient';

export interface Review {
  id: string;
  celularId: string;
  autorId: string;
  autorNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    const response = await httpClient.get<Review[]>(`/resenas/producto/${productId}`);
    return response.data;
  },

  async create(productId: string, data: { calificacion: number; comentario: string }): Promise<Review> {
    const response = await httpClient.post<Review>(`/resenas/producto/${productId}`, data);
    return response.data;
  },

  async update(id: string, data: { calificacion: number; comentario: string }): Promise<Review> {
    const response = await httpClient.put<Review>(`/resenas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/resenas/${id}`);
  },
};