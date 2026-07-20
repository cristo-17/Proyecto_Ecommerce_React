import { httpClient } from '../api/httpClient';

export interface Proveedor {
  id: string;
  razonSocial: string;
  ruc: string;
  emailContacto: string;
  telefono: string;
  direccion: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const proveedorService = {
  async getAll(): Promise<Proveedor[]> {
    const response = await httpClient.get<Proveedor[]>('/proveedores');
    return response.data;
  },

  async getById(id: string): Promise<Proveedor> {
    const response = await httpClient.get<Proveedor>(`/proveedores/${id}`);
    return response.data;
  },

  async getMyProfile(): Promise<Proveedor> {
    const response = await httpClient.get<Proveedor>('/proveedores/me');
    return response.data;
  },

  async create(data: Partial<Proveedor>): Promise<Proveedor> {
    const response = await httpClient.post<Proveedor>('/proveedores', data);
    return response.data;
  },

  async update(id: string, data: Partial<Proveedor>): Promise<Proveedor> {
    const response = await httpClient.put<Proveedor>(`/proveedores/${id}`, data);
    return response.data;
  },

  async updateMyProfile(data: Partial<Proveedor>): Promise<Proveedor> {
    const response = await httpClient.put<Proveedor>('/proveedores/me', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/proveedores/${id}`);
  },
};