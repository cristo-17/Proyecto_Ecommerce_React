// src/presentation/pages/Dashboard.tsx
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/alert"; // <-- Añadido para notificaciones consistentes
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Plus, Ticket, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuthStore } from "../../application/store/useAuthStore";
import {
  dashboardService,
  type DashboardData,
} from "../../infrastructure/services/dashboardService";
import {
  couponService,
  type Cupon,
} from "../../infrastructure/services/couponService";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const currentRole = user?.rol || "PROVEEDOR";
  const currentUserCompany = user?.nombre || "Mi Empresa";
  const isGlobalAdmin = currentRole === "ADMIN";

  const { theme } = useTheme();

  // Estado global para notificaciones UI
  const [notification, setNotification] = useState<{
    message: string;
    type: "danger" | "success";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "danger" | "success" = "danger",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Estados para datos del backend
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para cupones (se actualizan por separado o vienen en dashboard)
  const [cupones, setCupones] = useState<Cupon[]>([]);

  // Estados de modales
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    codigo: "",
    descuento: 10,
    fechaCaducidad: "",
    limite: 100,
  });
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // Cargar datos del dashboard
  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);

      // Si el backend devuelve cupones dentro del dashboard (admin), los usamos
      if (data.cupones) {
        setCupones(data.cupones);
      } else {
        // Si no, cargamos cupones por separado (para admin)
        if (isGlobalAdmin) {
          const coupons = await couponService.getAll();
          setCupones(coupons);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [isGlobalAdmin]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Variables para la UI
  const totalIngresos = dashboardData?.totalIngresos || 0;
  const totalEquipos = dashboardData?.totalEquipos || 0;
  const historialVentas = dashboardData?.historialVentas || [];
  const inventario = dashboardData?.inventario || [];

  // Columnas dinámicas para la tabla de inventario
  const columnasInventario = [
    { key: "modelo", label: "MODELO" },
    ...(isGlobalAdmin ? [{ key: "proveedor", label: "PROVEEDOR" }] : []),
    { key: "cantidad", label: "STOCK" },
    { key: "estado", label: "ESTADO" },
    { key: "ingresoTotal", label: "VALOR TOTAL" },
  ];

  // Columnas para cupones
  const columnasCupones = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "descuento", label: "DESCUENTO" },
    { key: "fechaCaducidad", label: "EXPIRACIÓN" },
    { key: "usos", label: "USOS" },
    { key: "estado", label: "ESTADO" },
  ];

  // Renderizado de celdas de inventario
  const renderCellInventario = useCallback(
    (item: any, columnKey: React.Key) => {
      switch (columnKey) {
        case "modelo":
          return (
            <span className="text-default-500 font-light">{item.modelo}</span>
          );
        case "proveedor":
          return (
            <span className="text-default-500 font-light">
              {item.proveedor}
            </span>
          );
        case "cantidad":
          return (
            <span className="text-default-500 font-light">{item.cantidad}</span>
          );
        case "estado":
          return (
            <Chip
              color={item.estado === "OPTIMO" ? "success" : "danger"}
              size="sm"
              variant="flat"
              className="font-medium tracking-wide bg-opacity-20"
            >
              {item.estado}
            </Chip>
          );
        case "ingresoTotal":
          return (
            <span className="font-medium text-foreground tracking-tight">
              ${item.ingresoTotal?.toLocaleString()}
            </span>
          );
        default:
          return null;
      }
    },
    [],
  );

  // Renderizado de celdas de cupones
  const renderCellCupon = useCallback((cupon: Cupon, columnKey: React.Key) => {
    switch (columnKey) {
      case "codigo":
        return (
          <span className="font-semibold text-foreground tracking-tight">
            {cupon.codigo}
          </span>
        );
      case "descuento":
        return (
          <span className="text-default-500 font-medium">
            {cupon.descuento}%
          </span>
        );
      case "fechaCaducidad":
        return (
          <span className="text-default-500 font-light">
            {cupon.fechaCaducidad}
          </span>
        );
      case "usos":
        return (
          <span className="text-default-500 font-light">
            {cupon.usos} / {cupon.limite}
          </span>
        );
      case "estado":
        return (
          <Chip
            color={
              cupon.estado === "Activo"
                ? "success"
                : cupon.estado === "Expirado"
                  ? "danger"
                  : "default"
            }
            size="sm"
            variant="flat"
            className="font-medium tracking-wide"
          >
            {cupon.estado}
          </Chip>
        );
      default:
        return null;
    }
  }, []);

  // Manejar creación de cupón
  const handleCreateCoupon = async () => {
    if (
      !newCoupon.codigo ||
      !newCoupon.fechaCaducidad ||
      !newCoupon.descuento ||
      !newCoupon.limite
    ) {
      showNotification(
        "Por favor completa todos los campos del cupón.",
        "danger",
      );
      return;
    }

    setIsCreatingCoupon(true);
    try {
      await couponService.create({
        codigo: newCoupon.codigo,
        descuento: newCoupon.descuento,
        fechaCaducidad: newCoupon.fechaCaducidad,
        limite: newCoupon.limite,
      });
      setIsCouponModalOpen(false);
      setNewCoupon({
        codigo: "",
        descuento: 10,
        fechaCaducidad: "",
        limite: 100,
      });
      showNotification("Cupón creado exitosamente", "success");

      // Refrescar cupones
      if (isGlobalAdmin) {
        const coupons = await couponService.getAll();
        setCupones(coupons);
      }
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al crear cupón",
        "danger",
      );
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  // Variables para el gráfico
  const chartColor = theme === "dark" ? "#ffffff" : "#18181b";
  const chartBg = theme === "dark" ? "#18181b" : "#ffffff";
  const chartBorder = theme === "dark" ? "#27272a" : "#e4e4e7";

  return (
    <div className="relative flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12 px-4 sm:px-0">
      {/* Alerta Flotante Global UI */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color={notification.type}
            title={notification.type === "danger" ? "Error" : "Éxito"}
            description={notification.message}
          />
        </div>
      )}

      {/* CABECERA PRINCIPAL (Siempre Visible) */}
      <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            {isGlobalAdmin
              ? "Resumen Global del Sistema"
              : "Resumen de mi Tienda"}
          </h1>
          <p className="text-default-500 font-light mt-2 tracking-wide">
            {isGlobalAdmin
              ? "Métricas consolidadas de todos los proveedores y operaciones."
              : `Métricas exclusivas para ${currentUserCompany}.`}
          </p>
        </div>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <Tabs
        aria-label="Opciones del Dashboard"
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
        {/* PESTAÑA 1: RESUMEN GENERAL */}
        <Tab
          key="resumen"
          title={
            <div className="flex items-center gap-2">
              <LayoutDashboard size={18} strokeWidth={2} />
              <span>Resumen General</span>
            </div>
          }
        >
          {/* Lógica de carga integrada DENTRO de la pestaña */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <div className="w-10 h-10 border-3 border-default-200 border-t-foreground rounded-full animate-spin mb-4"></div>
              <p className="text-default-500 font-light text-lg">
                Cargando métricas...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px] gap-4">
              <p className="text-danger font-medium">{error}</p>
              <Button color="default" variant="flat" onPress={fetchDashboard}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pt-6 animate-appearance-in">
              {/* TARJETAS KPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  shadow="none"
                  className="bg-content1 border border-divider rounded-2xl"
                >
                  <CardHeader className="pb-0 pt-7 px-7 flex-col items-start">
                    <p className="text-xs uppercase font-semibold text-default-400 tracking-widest">
                      {isGlobalAdmin
                        ? "Valor Total en Inventario"
                        : "Tus Ingresos Proyectados"}
                    </p>
                  </CardHeader>
                  <CardBody className="py-4 px-7">
                    <h4 className="font-bold text-4xl text-foreground tracking-tight">
                      ${totalIngresos.toLocaleString()}
                    </h4>
                  </CardBody>
                </Card>

                <Card
                  shadow="none"
                  className="bg-content1 border border-divider rounded-2xl"
                >
                  <CardHeader className="pb-0 pt-7 px-7 flex-col items-start">
                    <p className="text-xs uppercase font-semibold text-default-400 tracking-widest">
                      {isGlobalAdmin
                        ? "Equipos Registrados (Global)"
                        : "Tus Equipos en Stock"}
                    </p>
                  </CardHeader>
                  <CardBody className="py-4 px-7">
                    <h4 className="font-bold text-4xl text-foreground tracking-tight">
                      {totalEquipos}{" "}
                      <span className="text-xl font-light text-default-400 ml-1">
                        unidades
                      </span>
                    </h4>
                  </CardBody>
                </Card>
              </div>

              {/* GRÁFICO DE RENDIMIENTO DE VENTAS */}
              <Card
                shadow="none"
                className="w-full h-[450px] bg-content1 border border-divider rounded-2xl"
              >
                <CardHeader className="px-8 pt-8 pb-4">
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    {isGlobalAdmin
                      ? "Rendimiento de Ventas Global"
                      : "Historial de mis Ventas"}
                  </h2>
                </CardHeader>
                <CardBody className="px-8 pb-8 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historialVentas}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorVentas"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={chartColor}
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor={chartColor}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="mes"
                        stroke="#a1a1aa"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#a1a1aa"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        dx={-10}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={theme === "dark" ? "#27272a" : "#f4f4f5"}
                      />
                      <Tooltip
                        formatter={(value: any) => {
                          const valorSeguro = Number(value || 0);
                          return [
                            `$${valorSeguro.toLocaleString()}`,
                            "Ingresos",
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: chartBg,
                          borderRadius: "12px",
                          border: `1px solid ${chartBorder}`,
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                          color: chartColor,
                          fontWeight: 500,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ventas"
                        stroke={chartColor}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVentas)"
                        activeDot={{
                          r: 6,
                          fill: chartColor,
                          stroke: chartBg,
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              {/* TABLA DE INVENTARIO */}
              <Card
                shadow="none"
                className="bg-content1 border border-divider rounded-2xl overflow-hidden"
              >
                <CardHeader className="px-8 pt-8 pb-5 border-b border-divider">
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    {isGlobalAdmin
                      ? "Detalle Operativo Consolidado"
                      : "Tu Inventario Registrado"}
                  </h2>
                </CardHeader>
                <CardBody className="px-0 pb-0">
                  <Table
                    aria-label="Tabla de inventario"
                    removeWrapper
                    classNames={{
                      th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-8 py-4 border-b border-divider uppercase",
                      td: "px-8 py-4 border-b border-divider last:border-0",
                    }}
                  >
                    <TableHeader columns={columnasInventario}>
                      {(columna: any) => (
                        <TableColumn key={columna.key}>
                          {columna.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody
                      items={inventario}
                      emptyContent="No hay datos de inventario disponibles."
                    >
                      {(item: any) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-default-100 transition-colors"
                        >
                          {(columnKey) => (
                            <TableCell>
                              {renderCellInventario(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          )}
        </Tab>

        {/* PESTAÑA 2: GESTIÓN DE CUPONES (solo admin) */}
        {isGlobalAdmin && (
          <Tab
            key="cupones"
            title={
              <div className="flex items-center gap-2">
                <Ticket size={18} strokeWidth={2} />
                <span>Gestión de Cupones</span>
              </div>
            }
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="w-10 h-10 border-3 border-default-200 border-t-foreground rounded-full animate-spin mb-4"></div>
                <p className="text-default-500 font-light text-lg">
                  Cargando cupones...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px] gap-4">
                <p className="text-danger font-medium">{error}</p>
                <Button color="default" variant="flat" onPress={fetchDashboard}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8 pt-6 animate-appearance-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-content1 p-8 rounded-2xl border border-divider gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                      Cupones de Descuento
                    </h2>
                    <p className="text-default-500 font-light mt-1 tracking-wide">
                      Administra las campañas de marketing y ofertas activas en
                      la plataforma.
                    </p>
                  </div>
                  <Button
                    onPress={() => setIsCouponModalOpen(true)}
                    color="default"
                    size="lg"
                    className="font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
                    startContent={<Plus size={18} strokeWidth={2} />}
                  >
                    Nuevo Cupón
                  </Button>
                </div>

                <Card
                  shadow="none"
                  className="bg-content1 border border-divider rounded-2xl overflow-hidden"
                >
                  <CardBody className="px-0 pb-0 pt-0">
                    <Table
                      aria-label="Tabla de gestión de cupones"
                      removeWrapper
                      classNames={{
                        th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-8 py-5 border-b border-divider uppercase",
                        td: "px-8 py-4 border-b border-divider last:border-0",
                      }}
                    >
                      <TableHeader columns={columnasCupones}>
                        {(columna: any) => (
                          <TableColumn key={columna.key}>
                            {columna.label}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        items={cupones}
                        emptyContent="No se encontraron cupones activos."
                      >
                        {(item) => (
                          <TableRow
                            key={item.id}
                            className="hover:bg-default-100 transition-colors"
                          >
                            {(columnKey) => (
                              <TableCell>
                                {renderCellCupon(item, columnKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </div>
            )}
          </Tab>
        )}
      </Tabs>

      {/* MODAL: NUEVO CUPÓN */}
      <Modal
        isOpen={isCouponModalOpen}
        onOpenChange={setIsCouponModalOpen}
        classNames={{
          base: "bg-content1",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-semibold text-foreground">
                Crear Nuevo Cupón
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col gap-5">
                <Input
                  label="Código del Cupón"
                  placeholder="Ej. VERANO20"
                  variant="bordered"
                  value={newCoupon.codigo}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      codigo: e.target.value.toUpperCase(),
                    })
                  }
                  classNames={{
                    inputWrapper:
                      "border-divider bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground",
                    label: "text-default-500 font-medium text-xs",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="Porcentaje de Descuento (%)"
                  type="number"
                  placeholder="Ej. 10"
                  variant="bordered"
                  value={newCoupon.descuento.toString()}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      descuento: Number(e.target.value),
                    })
                  }
                  classNames={{
                    inputWrapper:
                      "border-divider bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground",
                    label: "text-default-500 font-medium text-xs",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="Fecha de Caducidad"
                  type="date"
                  variant="bordered"
                  value={newCoupon.fechaCaducidad}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      fechaCaducidad: e.target.value,
                    })
                  }
                  classNames={{
                    inputWrapper:
                      "border-divider bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground",
                    label: "text-default-500 font-medium text-xs",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="Límite de Usos Totales"
                  type="number"
                  placeholder="Ej. 100"
                  variant="bordered"
                  value={newCoupon.limite.toString()}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      limite: Number(e.target.value),
                    })
                  }
                  classNames={{
                    inputWrapper:
                      "border-divider bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground",
                    label: "text-default-500 font-medium text-xs",
                    input: "text-foreground",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  color="default"
                  onPress={onClose}
                  className="font-medium text-default-500 hover:text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  color="default"
                  onPress={handleCreateCoupon}
                  isLoading={isCreatingCoupon}
                  className="font-medium bg-foreground text-background shadow-none hover:opacity-80"
                >
                  Guardar Cupón
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
