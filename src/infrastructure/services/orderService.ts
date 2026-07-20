import { httpClient } from "../api/httpClient";

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  deliveryMethod: string;
  direccion?: string;
  referencia?: string;
  nombre?: string;
  dni?: string;
  telefono?: string;
  metodoPago: string;
  codigoCupon?: string;
}

export interface OrderResponse {
  id: string;
  total: number;
  descuento: number;
  impuestos: number;
  estado: string;
  metodoPago: string;
  direccionEntrega?: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  fechaCreacion: string;
  payuParams?: any;
}

export const orderService = {
  async create(data: OrderRequest): Promise<OrderResponse> {
    const response = await httpClient.post<OrderResponse>("/pedidos", data);
    return response.data;
  },

  async getById(id: string): Promise<OrderResponse> {
    const response = await httpClient.get<OrderResponse>(`/pedidos/${id}`);
    return response.data;
  },

  async getByReferenceCode(codigoReferencia: string): Promise<OrderResponse> {
    const response = await httpClient.get<OrderResponse>(
      `/pedidos/referencia/${codigoReferencia}`,
    );
    return response.data;
  },

  async getMyOrders(): Promise<OrderResponse[]> {
    const response = await httpClient.get<OrderResponse[]>("/pedidos");
    return response.data;
  },

  async updateShippingStatus(
    id: string,
    estado: string,
  ): Promise<OrderResponse> {
    const response = await httpClient.patch<OrderResponse>(
      `/pedidos/${id}/estado-envio`,
      null,
      {
        params: { estado },
      },
    );
    return response.data;
  },
};
