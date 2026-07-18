// src/presentation/pages/ProviderDashboard.tsx
import { useState } from "react";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Package, Truck, ChevronDown } from "lucide-react";

import { ProviderInventoryTable } from "../components/provider/ProviderInventoryTable";
import { ProviderProductModal } from "../components/provider/ProviderProductModal";
import { ProviderDeleteModal } from "../components/provider/ProviderDeleteModal";
import type { Product } from "../../domain/models/appCelulares.model";
import { useAuthStore } from "../../application/store/useAuthStore";

// 1. Mock Data de Inventario
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "cel-001",
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra - BMW M Edition",
    precio: 1450,
    stock: 12,
    imagenUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6idTnBxqn8EtuoOsQ4xT8eviWVTdS9EVix0WzyMavj0EbgA_yRw15nxc&s=10",
    proveedor: "Samsung Global",
    especificaciones: {
      ram: "12GB",
      almacenamiento: "512GB",
      pantalla: "6.8 AMOLED",
      procesador: "Snapdragon 8 Gen 3",
      camaraPrincipal: "200MP",
      bateria: "5000mAh",
    },
  },
  {
    id: "cel-002",
    marca: "Apple",
    modelo: "iPhone 15 Pro Max",
    precio: 1299,
    stock: 5,
    imagenUrl:
      "https://http2.mlstatic.com/D_Q_NP_801419-MLA93327187554_092025-O.webp",
    proveedor: "AppleCorp",
    especificaciones: {
      ram: "8GB",
      almacenamiento: "256GB",
      pantalla: "6.7 OLED",
      procesador: "A17 Pro",
      camaraPrincipal: "48MP",
      bateria: "4422mAh",
    },
  },
];

// 2. Mock Data de Pedidos / Logística
type PaymentStatus = "Pagado" | "Pendiente" | "Rechazado";
type ShippingStatus = "Pendiente" | "Preparando" | "Despachado" | "Entregado";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-298374",
    customer: "Juan Pérez",
    date: "17 Jul 2026",
    total: 1450,
    paymentStatus: "Pagado",
    shippingStatus: "Pendiente",
  },
  {
    id: "ORD-928371",
    customer: "María López",
    date: "18 Jul 2026",
    total: 1299,
    paymentStatus: "Pendiente",
    shippingStatus: "Pendiente",
  },
  {
    id: "ORD-102938",
    customer: "Carlos Ruiz",
    date: "19 Jul 2026",
    total: 2900,
    paymentStatus: "Rechazado",
    shippingStatus: "Pendiente",
  },
  {
    id: "ORD-564738",
    customer: "Ana Gómez",
    date: "20 Jul 2026",
    total: 999,
    paymentStatus: "Pagado",
    shippingStatus: "Despachado",
  },
];

export const ProviderDashboard = () => {
  // LECTURA DE ROL (Auth Integration)
  const { user } = useAuthStore();
  const userRole = user?.rol || localStorage.getItem("user_role") || "INVITADO";
  const currentUserCompany = user?.nombre || "Samsung Global";

  // Filtramos la data: El Admin ve todo, el Proveedor solo lo suyo
  const displayedProducts =
    userRole === "ADMIN"
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.proveedor === currentUserCompany);

  // Estados
  const [products, setProducts] = useState<Product[]>(displayedProducts);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- MANEJADORES DEL INVENTARIO ---
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = (data: Product) => {
    const productData = { ...data, proveedor: currentUserCompany };
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? { ...productData, id: selectedProduct.id }
            : p,
        ),
      );
    } else {
      setProducts([...products, { ...productData, id: `cel-${Date.now()}` }]);
    }
    setIsProductModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  // --- MANEJADORES DE PEDIDOS LOGÍSTICOS ---
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Pagado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Rechazado":
        return "danger";
      default:
        return "default";
    }
  };

  const getShippingStatusColor = (status: ShippingStatus) => {
    switch (status) {
      case "Entregado":
        return "success";
      case "Despachado":
        return "primary";
      case "Preparando":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleUpdateShipping = (orderId: string, newStatus: ShippingStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, shippingStatus: newStatus } : order,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto min-h-screen pb-12">
      {/* CABECERA PRINCIPAL DINÁMICA */}
      <div className="pt-4 px-4 lg:px-0">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {userRole === "ADMIN"
            ? "Panel de Administración"
            : `Dashboard de ${currentUserCompany}`}
        </h1>
        <p className="text-default-500 font-light mt-2 tracking-wide text-lg">
          {userRole === "ADMIN"
            ? "Supervisa todas las operaciones, inventarios y ventas del sistema."
            : "Gestiona tu inventario y monitorea el rendimiento logístico en tiempo real."}
        </p>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <Tabs
        aria-label="Opciones del Panel"
        variant="underlined"
        color="default"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none px-4 lg:px-0 border-b border-divider",
          cursor: "w-full bg-foreground",
          tab: "max-w-fit px-0 h-12",
          tabContent:
            "group-data-[selected=true]:text-foreground text-default-500 font-medium tracking-wide pb-2",
        }}
      >
        {/* ==========================================
            PESTAÑA 1: GESTIÓN DE INVENTARIO
            ========================================== */}
        <Tab
          key="inventario"
          title={
            <div className="flex items-center gap-2">
              <Package size={18} strokeWidth={2} />
              <span>Gestión de Inventario</span>
            </div>
          }
        >
          <div className="flex flex-col gap-8 pt-6 px-4 lg:px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-content1 p-8 rounded-2xl border border-divider gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                  {userRole === "ADMIN" ? "Inventario Global" : "Mi Inventario"}
                </h2>
                <p className="text-default-500 font-light mt-2 tracking-wide">
                  {userRole === "ADMIN"
                    ? "Vista de solo lectura de todos los equipos registrados."
                    : "Gestiona los equipos que ofreces en la plataforma."}
                </p>
              </div>

              {userRole === "PROVEEDOR" && (
                <Button
                  onPress={handleOpenCreate}
                  color="default"
                  size="lg"
                  className="font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
                >
                  + Publicar Nuevo Equipo
                </Button>
              )}
            </div>

            <div className="bg-content1 rounded-2xl border border-divider overflow-x-auto">
              <ProviderInventoryTable
                products={products}
                role={userRole}
                onEditClick={handleOpenEdit}
                onDeleteClick={handleOpenDelete}
              />
            </div>
          </div>
        </Tab>

        {/* ==========================================
            PESTAÑA 2: CONTROL DE PEDIDOS (NUEVA)
            ========================================== */}
        <Tab
          key="pedidos"
          title={
            <div className="flex items-center gap-2">
              <Truck size={18} strokeWidth={2} />
              <span>Control de Pedidos</span>
            </div>
          }
        >
          <div className="pt-6 px-4 lg:px-0">
            <div className="bg-content1 rounded-2xl border border-divider overflow-hidden shadow-sm">
              <Table
                aria-label="Control de Pedidos Logísticos"
                removeWrapper
                classNames={{
                  th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-8 py-4 border-b border-divider uppercase",
                  td: "px-8 py-5 border-b border-divider last:border-0",
                }}
              >
                <TableHeader>
                  <TableColumn>ID Pedido</TableColumn>
                  <TableColumn>Cliente</TableColumn>
                  <TableColumn>Fecha</TableColumn>
                  <TableColumn>Total</TableColumn>
                  <TableColumn>Estado de Pago (PayU)</TableColumn>
                  <TableColumn>Estado de Envío</TableColumn>
                  <TableColumn align="center">Acciones</TableColumn>
                </TableHeader>
                <TableBody items={orders}>
                  {(order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-default-50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground tracking-tight">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-default-500 font-medium">
                        {order.customer}
                      </TableCell>
                      <TableCell className="text-default-500 font-light">
                        {order.date}
                      </TableCell>
                      <TableCell className="font-bold text-foreground tracking-tight">
                        $
                        {order.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>

                      {/* Estado de Pago PayU */}
                      <TableCell>
                        <Chip
                          color={getPaymentStatusColor(order.paymentStatus)}
                          variant="flat"
                          size="sm"
                          className="font-medium tracking-wide"
                        >
                          {order.paymentStatus}
                        </Chip>
                      </TableCell>

                      {/* Estado de Envío Logístico */}
                      <TableCell>
                        <Chip
                          color={getShippingStatusColor(order.shippingStatus)}
                          variant="dot"
                          size="sm"
                          className="font-medium tracking-wide border-none bg-transparent px-0"
                        >
                          {order.shippingStatus}
                        </Chip>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell>
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button
                              variant="flat"
                              color="default"
                              size="sm"
                              isDisabled={order.paymentStatus !== "Pagado"}
                              endContent={<ChevronDown size={14} />}
                              className="font-medium"
                            >
                              Actualizar
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Acciones logísticas"
                            onAction={(key) =>
                              handleUpdateShipping(
                                order.id,
                                key as ShippingStatus,
                              )
                            }
                          >
                            <DropdownItem key="Preparando">
                              Preparando
                            </DropdownItem>
                            <DropdownItem key="Despachado">
                              Despachado
                            </DropdownItem>
                            <DropdownItem key="Entregado">
                              Entregado
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* MODALES DEL INVENTARIO */}
      <ProviderProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={selectedProduct}
        onSave={handleSaveProduct}
      />

      <ProviderDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
