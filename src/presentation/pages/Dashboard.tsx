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
              className="font-medium tracking-wide bg-opacity-20"
            >
              {cellValue}
            </Chip>
          );
        case "ingresoTotal":
          return (
            <span className="font-medium text-zinc-900 tracking-tight">
              ${cellValue.toLocaleString()}
            </span>
          );
        default:
          return <span className="text-zinc-600 font-light">{cellValue}</span>;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* CABECERA */}
      <div className="mb-2">
        <h1 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight">
          {isGlobalAdmin
            ? "Resumen Global del Sistema"
            : "Resumen de mi Tienda"}
        </h1>
        <p className="text-zinc-500 font-light mt-2 tracking-wide">
          {isGlobalAdmin
            ? "Métricas consolidadas de todos los proveedores."
            : `Métricas exclusivas para ${currentUserCompany}.`}
        </p>
      </div>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          shadow="none"
          className="bg-white border border-zinc-200/60 rounded-2xl"
        >
          <CardHeader className="pb-0 pt-7 px-7 flex-col items-start">
            <p className="text-xs uppercase font-semibold text-zinc-400 tracking-widest">
              {isGlobalAdmin
                ? "Valor Total en Inventario"
                : "Tus Ingresos Proyectados"}
            </p>
          </CardHeader>
          <CardBody className="py-4 px-7">
            <h4 className="font-bold text-4xl text-zinc-900 tracking-tight">
              ${totalIngresos.toLocaleString()}
            </h4>
          </CardBody>
        </Card>

        <Card
          shadow="none"
          className="bg-white border border-zinc-200/60 rounded-2xl"
        >
          <CardHeader className="pb-0 pt-7 px-7 flex-col items-start">
            <p className="text-xs uppercase font-semibold text-zinc-400 tracking-widest">
              {isGlobalAdmin
                ? "Equipos Registrados (Global)"
                : "Tus Equipos en Stock"}
            </p>
          </CardHeader>
          <CardBody className="py-4 px-7">
            <h4 className="font-bold text-4xl text-zinc-900 tracking-tight">
              {totalEquipos}{" "}
              <span className="text-xl font-light text-zinc-400 ml-1">
                unidades
              </span>
            </h4>
          </CardBody>
        </Card>
      </div>

      {/* GRÁFICO DE RENDIMIENTO DE VENTAS */}
      <Card
        shadow="none"
        className="w-full h-[450px] bg-white border border-zinc-200/60 rounded-2xl"
      >
        <CardHeader className="px-8 pt-8 pb-4">
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
            {isGlobalAdmin
              ? "Rendimiento de Ventas Global"
              : "Historial de mis Ventas"}
          </h2>
        </CardHeader>
        <CardBody className="px-8 pb-8 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
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
                stroke="#f4f4f5"
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  const valorSeguro = Number(value || 0);
                  return [
                    `$${valorSeguro.toLocaleString()}`,
                    name === "ventas" ? "Ingresos" : name,
                  ];
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  color: "#18181b",
                  fontWeight: 500,
                }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#18181b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentas)"
                activeDot={{
                  r: 6,
                  fill: "#18181b",
                  stroke: "#ffffff",
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
        className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden"
      >
        <CardHeader className="px-8 pt-8 pb-5 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
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
              th: "bg-zinc-50/50 text-zinc-500 font-semibold tracking-wider text-xs px-8 py-4 border-b border-zinc-100 uppercase",
              td: "px-8 py-4 border-b border-zinc-50 last:border-0",
            }}
          >
            <TableHeader columns={columnas}>
              {(columna: any) => (
                <TableColumn key={columna.key}>{columna.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={filteredData}>
              {(item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
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
