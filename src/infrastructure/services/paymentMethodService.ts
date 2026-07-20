import { httpClient } from '../api/httpClient';

export interface PaymentMethod {
  id: string;
  numeroTarjeta: string;
  titular: string;
  fechaExpiracion: string;
}

export const paymentMethodService = {
  async getMyMethods(): Promise<PaymentMethod[]> {
    const response = await httpClient.get<PaymentMethod[]>('/formas-pago');
    return response.data;
  },

  async add(data: { numeroTarjeta: string; titular: string; fechaExpiracion: string }): Promise<PaymentMethod> {
    const response = await httpClient.post<PaymentMethod>('/formas-pago', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/formas-pago/${id}`);
  },
};