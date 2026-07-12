// src/presentation/pages/Dashboard.tsx
import { useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- TIPOS Y MOCK DATA ---
interface Transaccion {
  id: string;
  modelo: string;
  proveedor: string;
  cantidad: number;
  estado: "STOCK_BAJO" | "OPTIMO";
  ingresoTotal: number;
}

const MOCK_TRANSACTIONS: Transaccion[] = [
  {
    id: "tx-1",
    modelo: "iPhone 15 Pro Max",
    proveedor: "AppleCorp",
    cantidad: 50,
    estado: "OPTIMO",
    ingresoTotal: 60000,
  },
  {
    id: "tx-2",
    modelo: "Samsung Galaxy S24 Ultra",
    proveedor: "Samsung Global",
    cantidad: 5,
    estado: "STOCK_BAJO",
    ingresoTotal: 7250,
  },
  {
    id: "tx-3",
    modelo: "Xiaomi 14 Ultra",
    proveedor: "Xiaomi Peru",
    cantidad: 120,
    estado: "OPTIMO",
    ingresoTotal: 72000,
  },
];

const CHART_DATA_ADMIN = [
  { mes: "Ene", ventas: 45000 },
  { mes: "Feb", ventas: 52000 },
  { mes: "Mar", ventas: 48000 },
  { mes: "Abr", ventas: 61000 },
  { mes: "May", ventas: 59000 },
  { mes: "Jun", ventas: 75000 },
];

const CHART_DATA_PROVEEDOR = [
  { mes: "Ene", ventas: 12000 },
  { mes: "Feb", ventas: 15000 },
  { mes: "Mar", ventas: 14000 },
  { mes: "Abr", ventas: 18000 },
  { mes: "May", ventas: 17000 },
  { mes: "Jun", ventas: 22000 },
];

export const Dashboard = () => {
  const currentRole = localStorage.getItem("user_role") || "PROVEEDOR";
  const currentUserCompany = "Samsung Global";

  const isGlobalAdmin = currentRole === "ADMIN";

  // Selección de datos condicional
  const filteredData = isGlobalAdmin
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter((tx) => tx.proveedor === currentUserCompany);
  const chartData = isGlobalAdmin ? CHART_DATA_ADMIN : CHART_DATA_PROVEEDOR;

  const totalIngresos = filteredData.reduce(
    (acc, curr) => acc + curr.ingresoTotal,
    0,
  );
  const totalEquipos = filteredData.reduce(
    (acc, curr) => acc + curr.cantidad,
    0,
  );

  const columnas = [
    { key: "modelo", label: "MODELO" },
    ...(isGlobalAdmin ? [{ key: "proveedor", label: "PROVEEDOR" }] : []),
    { key: "cantidad", label: "STOCK" },
    { key: "estado", label: "ESTADO" },
    { key: "ingresoTotal", label: "VALOR TOTAL" },
  ];

  const renderCell = useCallback(
    (transaccion: Transaccion, columnKey: React.Key) => {
      const cellValue = transaccion[columnKey as keyof Transaccion];
      switch (columnKey) {
        case "estado":
          return (
            <Chip
              color={transaccion.estado === "OPTIMO" ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "ingresoTotal":
          return (
            <span className="font-medium text-success">
              ${cellValue.toLocaleString()}
            </span>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* CABECERA */}
      <div className="mb-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
          {isGlobalAdmin
            ? "Resumen Global del Sistema"
            : "Resumen de mi Tienda"}
        </h1>
        <p className="text-default-500 mt-1">
          {isGlobalAdmin
            ? "Métricas consolidadas de todos los proveedores."
            : `Métricas exclusivas para ${currentUserCompany}.`}
        </p>
      </div>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold text-default-500">
              {isGlobalAdmin
                ? "Valor Total en Inventario"
                : "Tus Ingresos Proyectados"}
            </p>
          </CardHeader>
          <CardBody className="py-2">
            <h4 className="font-bold text-2xl text-success">
              ${totalIngresos.toLocaleString()}
            </h4>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold text-default-500">
              {isGlobalAdmin
                ? "Equipos Registrados (Global)"
                : "Tus Equipos en Stock"}
            </p>
          </CardHeader>
          <CardBody className="py-2">
            <h4 className="font-bold text-2xl">{totalEquipos} unidades</h4>
          </CardBody>
        </Card>
      </div>

      {/* GRÁFICO DE RENDIMIENTO DE VENTAS */}
      <Card className="w-full h-[400px]">
        <CardHeader className="px-6 pt-6">
          <h2 className="text-lg font-semibold">
            {isGlobalAdmin
              ? "Rendimiento de Ventas Global"
              : "Historial de mis Ventas"}
          </h2>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006FEE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#006FEE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="mes"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  // Nos aseguramos de que sea un número válido antes de formatearlo.
                  // Si viene undefined o vacío, lo convertimos a 0.
                  const valorSeguro = Number(value || 0);

                  return [
                    `$${valorSeguro.toLocaleString()}`,
                    name === "ventas" ? "Ingresos" : name,
                  ];
                }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#006FEE"
                fillOpacity={1}
                fill="url(#colorVentas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* TABLA */}
      <Card>
        <CardHeader className="px-6 pt-6">
          <h2 className="text-lg font-semibold">
            {isGlobalAdmin
              ? "Detalle Operativo Consolidado"
              : "Tu Inventario Registrado"}
          </h2>
        </CardHeader>
        <CardBody className="px-0 pb-0">
          <Table aria-label="Tabla de inventario" removeWrapper>
            <TableHeader columns={columnas}>
              {(columna: any) => (
                <TableColumn key={columna.key}>{columna.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={filteredData}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};
