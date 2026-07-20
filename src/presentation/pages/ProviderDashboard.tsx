// src/presentation/pages/ProviderDashboard.tsx
import { useState, useEffect, useCallback } from "react";
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
import { Alert } from "@heroui/alert"; // <-- Añadido para notificaciones UI
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
import { productService } from "../../infrastructure/services/productService";
import {
  orderService,
  type OrderResponse,
} from "../../infrastructure/services/orderService";
import { proveedorService } from "../../infrastructure/services/proveedorService";

export const ProviderDashboard = () => {
  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";
  const currentUserCompany = user?.nombre || "Mi Empresa";

  // Estado global estandarizado para notificaciones flotantes UI
  const [notification, setNotification] = useState<{
    message: string;
    type: "danger" | "success";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "danger" | "success" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Estados para productos
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Estados para pedidos
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Estados de modales y edición
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar productos
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      if (userRole === "PROVEEDOR") {
        // Obtener el perfil del proveedor para filtrar sus productos
        const profile = await proveedorService.getMyProfile();
        const response = await productService.getCatalog({
          proveedorId: profile.id,
        } as any);
        setProducts(response.content || []);
      } else {
        const response = await productService.getCatalog({});
        setProducts(response.content || []);
      }
    } catch (err: any) {
      setProductsError(
        err.response?.data?.message || "Error al cargar productos",
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }, [userRole]);

  // Cargar pedidos
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      // Obtenemos los pedidos del usuario actual (si es admin, verá todos; si es proveedor, solo los suyos)
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setOrdersError(err.response?.data?.message || "Error al cargar pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

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

  const handleSaveProduct = async (data: Product) => {
    setIsSaving(true);
    try {
      if (selectedProduct) {
        // Editar
        await productService.update(selectedProduct.id, data);
        showNotification("Producto actualizado correctamente.", "success");
      } else {
        // Crear
        await productService.create(data as any);
        showNotification("Nuevo producto publicado con éxito.", "success");
      }
      setIsProductModalOpen(false);
      await fetchProducts(); // Refrescar lista
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al guardar el producto",
        "danger",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await productService.delete(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      showNotification("Producto eliminado del inventario.", "success");
      await fetchProducts();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al eliminar el producto",
        "danger",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // --- MANEJADORES DE PEDIDOS LOGÍSTICOS ---
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pagado":
      case "COMPLETADO":
        return "success";
      case "Pendiente":
      case "PENDIENTE":
        return "warning";
      case "Rechazado":
      case "FALLIDO":
        return "danger";
      default:
        return "default";
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case "Entregado":
      case "ENTREGADO":
        return "success";
      case "Despachado":
      case "ENVIADO":
        return "primary";
      case "Preparando":
      case "PROCESANDO":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleUpdateShipping = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateShippingStatus(orderId, newStatus);
      // Actualizar estado localmente (o refrescar)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, estado: newStatus } : order,
        ),
      );
      showNotification("Estado de envío actualizado correctamente.", "success");
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al actualizar el estado de envío",
        "danger",
      );
    }
  };

  return (
    <div className="relative flex flex-col gap-8 w-full max-w-7xl mx-auto min-h-screen pb-12">
      {/* Alerta Flotante UI */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color={notification.type}
            title={notification.type === "danger" ? "Error" : "Éxito"}
            description={notification.message}
          />
        </div>
      )}

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

            {/* Contenedor Relativo para Evitar Saltos de Layout */}
            <div className="bg-content1 rounded-2xl border border-divider overflow-hidden relative min-h-[400px]">
              {isLoadingProducts && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1/70 backdrop-blur-sm">
                  <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
                  <p className="text-default-500 font-light mt-3 text-sm">
                    Cargando inventario...
                  </p>
                </div>
              )}

              {productsError && !isLoadingProducts && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1 gap-3">
                  <p className="text-danger font-medium">{productsError}</p>
                  <Button
                    color="default"
                    variant="flat"
                    onPress={fetchProducts}
                    size="sm"
                  >
                    Reintentar
                  </Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <ProviderInventoryTable
                  products={products}
                  role={userRole}
                  onEditClick={handleOpenEdit}
                  onDeleteClick={handleOpenDelete}
                />
              </div>
            </div>
          </div>
        </Tab>

        {/* ==========================================
            PESTAÑA 2: CONTROL DE PEDIDOS
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
            {/* Contenedor Relativo para Evitar Saltos de Layout */}
            <div className="bg-content1 rounded-2xl border border-divider overflow-hidden shadow-sm relative min-h-[300px]">
              {isLoadingOrders && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1/70 backdrop-blur-sm">
                  <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
                  <p className="text-default-500 font-light mt-3 text-sm">
                    Cargando pedidos...
                  </p>
                </div>
              )}

              {ordersError && !isLoadingOrders && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1 gap-3">
                  <p className="text-danger font-medium">{ordersError}</p>
                  <Button
                    color="default"
                    variant="flat"
                    onPress={fetchOrders}
                    size="sm"
                  >
                    Reintentar
                  </Button>
                </div>
              )}

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
                  <TableColumn>Estado de Pago</TableColumn>
                  <TableColumn>Estado de Envío</TableColumn>
                  <TableColumn align="center">Acciones</TableColumn>
                </TableHeader>
                <TableBody
                  items={orders}
                  emptyContent={
                    !isLoadingOrders && !ordersError
                      ? "No hay pedidos registrados en este momento."
                      : " "
                  }
                >
                  {(order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-default-50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground tracking-tight">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-default-500 font-medium">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="text-default-500 font-light">
                        {new Date(order.fechaCreacion).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold text-foreground tracking-tight">
                        $
                        {(order.total || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>

                      {/* Estado de Pago */}
                      <TableCell>
                        <Chip
                          color={getPaymentStatusColor(order.estado)}
                          variant="flat"
                          size="sm"
                          className="font-medium tracking-wide"
                        >
                          {order.estado}
                        </Chip>
                      </TableCell>

                      {/* Estado de Envío */}
                      <TableCell>
                        <Chip
                          color={getShippingStatusColor(order.estado)}
                          variant="dot"
                          size="sm"
                          className="font-medium tracking-wide border-none bg-transparent px-0"
                        >
                          {order.estado}
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
                              isDisabled={
                                order.estado === "ENTREGADO" ||
                                order.estado === "FALLIDO"
                              }
                              endContent={<ChevronDown size={14} />}
                              className="font-medium"
                            >
                              Actualizar
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Acciones logísticas"
                            onAction={(key) =>
                              handleUpdateShipping(order.id, key as string)
                            }
                          >
                            <DropdownItem key="PROCESANDO">
                              Preparando
                            </DropdownItem>
                            <DropdownItem key="ENVIADO">
                              Despachado
                            </DropdownItem>
                            <DropdownItem key="ENTREGADO">
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
