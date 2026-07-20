import { httpClient } from "../api/httpClient";
import type { Product } from "../../domain/models/appCelulares.model";

export interface ProductFilters {
  q?: string;
  marca?: string[];
  precioMin?: number;
  precioMax?: number;
  page?: number;
  size?: number;
  proveedorId?: string;
}

export const productService = {
  async getCatalog(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    if (filters.q) params.append("q", filters.q);
    if (filters.marca?.length)
      filters.marca.forEach((m) => params.append("marca", m));
    if (filters.precioMin != null)
      params.append("precioMin", String(filters.precioMin));
    if (filters.precioMax != null)
      params.append("precioMax", String(filters.precioMax));
    if (filters.proveedorId) params.append("proveedorId", filters.proveedorId);
    if (filters.page != null) params.append("page", String(filters.page));
    if (filters.size != null) params.append("size", String(filters.size));

    const response = await httpClient.get("/productos", { params });
    return response.data; // { content: Product[], totalPages, etc. }
  },

  async getById(id: string): Promise<Product> {
    const response = await httpClient.get<Product>(`/productos/${id}`);
    return response.data;
  },

  async create(product: Omit<Product, "id">): Promise<Product> {
    const response = await httpClient.post<Product>("/productos", product);
    return response.data;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const response = await httpClient.put<Product>(`/productos/${id}`, product);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/productos/${id}`);
  },
};
