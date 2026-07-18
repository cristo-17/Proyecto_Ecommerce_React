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
import { Package, TrendingUp } from "lucide-react";

import { ProviderInventoryTable } from "../components/provider/ProviderInventoryTable";
import { ProviderProductModal } from "../components/provider/ProviderProductModal";
import { ProviderDeleteModal } from "../components/provider/ProviderDeleteModal";
import type { Product } from "../../domain/models/appCelulares.model";
import { useAuthStore } from "../../application/store/useAuthStore";

// 1. Mock Data de Inventario (Original preservado)
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

// 2. Mock Data de Ventas (Nueva Implementación)
type SalesStatus = "Pagado" | "Enviado" | "Entregado";

interface Sale {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  income: number;
  status: SalesStatus;
  courier?: string;
}

const MOCK_SALES: Sale[] = [
  {
    id: "VTA-8923",
    date: "17 Jul 2026",
    productName: "Galaxy S24 Ultra - BMW M Edition",
    quantity: 2,
    income: 2900,
    status: "Entregado",
    courier: "Shalom",
  },
  {
    id: "VTA-9041",
    date: "22 Jul 2026",
    productName: "iPhone 15 Pro Max",
    quantity: 1,
    income: 1299,
    status: "Enviado",
    courier: "Shalom",
  },
  {
    id: "VTA-9102",
    date: "25 Jul 2026",
    productName: "Galaxy S24 Ultra - BMW M Edition",
    quantity: 1,
    income: 1450,
    status: "Pagado",
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

  const [products, setProducts] = useState<Product[]>(displayedProducts);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- MANEJADORES DEL INVENTARIO (ORIGINAL) ---
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
    // Inyectamos el proveedor automáticamente si es una creación
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

  // --- HELPERS PARA VENTAS ---
  const getSalesStatusColor = (status: SalesStatus) => {
    switch (status) {
      case "Entregado":
        return "success";
      case "Enviado":
        return "warning";
      case "Pagado":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto min-h-screen pb-12">
      {/* CABECERA PRINCIPAL DINÁMICA */}
      <div className="pt-4">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {userRole === "ADMIN"
            ? "Panel de Administración"
            : `Dashboard de ${currentUserCompany}`}
        </h1>
        <p className="text-default-500 font-light mt-2 tracking-wide text-lg">
          {userRole === "ADMIN"
            ? "Supervisa todas las operaciones, inventarios y ventas del sistema."
            : "Gestiona tu inventario y monitorea el rendimiento de tus ventas en tiempo real."}
        </p>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <Tabs
        aria-label="Opciones del Panel"
        variant="underlined"
        color="default"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
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
          <div className="flex flex-col gap-8 pt-6">
            {/* CÓDIGO JSX ORIGINAL INTACTO */}
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

              {/* Renderizado Condicional del Botón */}
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

            <div className="bg-content1 rounded-2xl border border-divider overflow-hidden">
              {/* Pasamos el rol a la tabla */}
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
            PESTAÑA 2: REGISTRO DE VENTAS
            ========================================== */}
        <Tab
          key="ventas"
          title={
            <div className="flex items-center gap-2">
              <TrendingUp size={18} strokeWidth={2} />
              <span>Registro de Ventas</span>
            </div>
          }
        >
          <div className="pt-6">
            <div className="bg-content1 rounded-2xl border border-divider overflow-hidden shadow-sm">
              <Table
                aria-label="Registro de Ventas del Proveedor"
                removeWrapper
                classNames={{
                  th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-8 py-4 border-b border-divider uppercase",
                  td: "px-8 py-5 border-b border-divider last:border-0",
                }}
              >
                <TableHeader>
                  <TableColumn>Nº Orden</TableColumn>
                  <TableColumn>Fecha</TableColumn>
                  <TableColumn>Producto Vendido</TableColumn>
                  <TableColumn>Cant.</TableColumn>
                  <TableColumn>Ingreso</TableColumn>
                  <TableColumn>Estado de Envío</TableColumn>
                </TableHeader>
                <TableBody items={MOCK_SALES}>
                  {(sale) => (
                    <TableRow
                      key={sale.id}
                      className="hover:bg-default-50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground tracking-tight">
                        {sale.id}
                      </TableCell>
                      <TableCell className="text-default-500 font-light">
                        {sale.date}
                      </TableCell>
                      <TableCell className="text-default-500 font-light">
                        {sale.productName}
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {sale.quantity}
                      </TableCell>
                      <TableCell className="font-bold text-success tracking-tight">
                        $
                        {sale.income.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <Chip
                            color={getSalesStatusColor(sale.status)}
                            variant="flat"
                            size="sm"
                            className="font-medium tracking-wide"
                          >
                            {sale.status}
                          </Chip>
                          {sale.courier && (
                            <span className="text-[10px] text-default-400 font-medium uppercase tracking-wider mt-1">
                              Logística: {sale.courier}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* MODALES DEL INVENTARIO ORIGINAL */}
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
