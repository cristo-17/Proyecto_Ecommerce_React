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
type RolContexto = "ADMIN" | "PROVEEDOR" | "VENDEDOR";

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
    modelo: "Samsung Galaxy S24 Ultra - BMW M Edition",
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

export const Dashboard = () => {
  // Lectura del rol real guardado en sesión, con fallback a PROVEEDOR por seguridad
  const currentRole =
    (localStorage.getItem("user_role") as RolContexto) || "PROVEEDOR";

  // En un caso real, el nombre del proveedor vendría del token JWT o un perfil cargado.
  const currentUserCompany = "Samsung Global";

  // --- LÓGICA DE FILTRADO ---
  const isGlobalAdmin = currentRole === "ADMIN";
  const filteredData = isGlobalAdmin
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter((tx) => tx.proveedor === currentUserCompany);

  const totalIngresos = filteredData.reduce(
    (acc, curr) => acc + curr.ingresoTotal,
    0,
  );
  const totalEquipos = filteredData.reduce(
    (acc, curr) => acc + curr.cantidad,
    0,
  );

  // --- CONFIGURACIÓN DE COLUMNAS (Lógica extraída del JSX) ---
  const columnas = [
    { key: "modelo", label: "MODELO" },
    ...(isGlobalAdmin ? [{ key: "proveedor", label: "PROVEEDOR" }] : []),
    { key: "cantidad", label: "STOCK" },
    { key: "estado", label: "ESTADO" },
    { key: "ingresoTotal", label: "VALOR TOTAL" },
  ];

  // --- RENDERIZADO DE CELDAS ---
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
      {/* CABECERA DINÁMICA */}
      <div>
        {isGlobalAdmin ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">
              Panel de Control Global
            </h1>
            <p className="text-default-500">Vista de Administrador General</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary">
              Bienvenido, {currentUserCompany}
            </h1>
            <p className="text-default-500">
              Gestión exclusiva para proveedor autorizado
            </p>
          </>
        )}
      </div>

      {/* TARJETAS DE MÉTRICAS */}
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

      {/* GRÁFICO RECHARTS (EXCLUSIVO PARA ADMIN) */}
      {isGlobalAdmin && (
        <Card className="w-full h-[400px]">
          <CardHeader className="px-6 pt-6">
            <h2 className="text-lg font-semibold">
              Rendimiento de Ventas (Últimos 6 meses)
            </h2>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CHART_DATA_ADMIN}
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
                      name === "ventas" ? "Ingresos" : name, // O simplemente "Ventas" como lo tenías
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
      )}

      {/* TABLA DE INVENTARIO */}
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
              {/* Tipado explícito 'any' para evitar conflictos de tipado con HeroUI en esta fase */}
              {(columna: any) => (
                <TableColumn key={columna.key}>{columna.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={filteredData}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    // La lógica condicional de la columna proveedor ahora está manejada nativamente
                    // por el arreglo de columnas en el TableHeader.
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
