// src/domain/models/appCelulares.model.ts
export const RolUsuario = {
  ADMIN: 'ADMIN',
  PROVEEDOR: 'PROVEEDOR',
  CLIENTE: 'CLIENTE'
} as const;

export type RolUsuario = (typeof RolUsuario)[keyof typeof RolUsuario];

// --- Estados de Pedido ---
export const EstadoPedido = {
  PENDIENTE: 'PENDIENTE',
  PROCESANDO: 'PROCESANDO',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO'
} as const;

export type EstadoPedido = (typeof EstadoPedido)[keyof typeof EstadoPedido];


// --- Estados de Pago ---
export const EstadoPago = {
  PENDIENTE: 'PENDIENTE',
  COMPLETADO: 'COMPLETADO',
  FALLIDO: 'FALLIDO'
} as const;

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  fechaRegistro: Date;
}

export interface Marca {
  id: string;
  nombre: string;
  paisOrigen: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Proveedor {
  id: string;
  razonSocial: string;
  ruc: string;
  emailContacto: string;
  telefono: string;
}

export interface Celular {
  id: string;
  modelo: string;
  marcaId: string;
  categoriaId: string;
  precio: number;
  especificaciones: string;
  proveedorId: string;
}

export interface Inventario {
  id: string;
  celularId: string;
  cantidadDisponible: number;
  ubicacionAlmacen: string;
  ultimaActualizacion: Date;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  fechaCreacion: Date;
  total: number;
  estado: EstadoPedido;
}

export interface DetallePedido {
  id: string;
  pedidoId: string;
  celularId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pago {
  id: string;
  pedidoId: string;
  monto: number;
  metodoPago: 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO';
  estado: EstadoPago;
  fechaTransaccion: Date;
}

export interface Despacho {
  id: string;
  pedidoId: string;
  direccionEntrega: string;
  transportista: string;
  numeroSeguimiento: string;
  fechaEstimada: Date;
}

export interface Product {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  proveedor: string;
  especificaciones: {
    ram: string;
    almacenamiento: string;
    pantalla: string;
    procesador: string;
    camaraPrincipal: string;
    bateria: string;
  };
}

export interface Resena {
  id: string;
  celularId: string;
  autorId: string;
  autorNombre: string;
  calificacion: number; // 1 a 5
  comentario: string;
  fecha: Date;
}

export interface FormaPago {
  id: string;
  usuarioId: string;
  numeroTarjeta: string; // Formato censurado: "**** **** **** 1234"
  titular: string;
  fechaExpiracion: string; // Formato: "MM/YY"
}

export const EstadoProveedor = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO'
} as const;

export type EstadoProveedor = (typeof EstadoProveedor)[keyof typeof EstadoProveedor];

export interface Proveedor {
  id: string;
  razonSocial: string;
  ruc: string;
  emailContacto: string;
  telefono: string;
  direccion?: string; // Para alinear con la UI
  estado: EstadoProveedor;
}