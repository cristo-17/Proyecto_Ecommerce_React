// src/presentation/components/provider/ProviderInventoryTable.tsx
import { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { Pencil, Trash2, Lock } from "lucide-react";
import type { Product } from "../../../domain/models/appCelulares.model";

interface ProviderInventoryTableProps {
  products: Product[];
  role: string;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

export const ProviderInventoryTable = ({
  products,
  role,
  onEditClick,
  onDeleteClick,
}: ProviderInventoryTableProps) => {
  const isAdmin = role === "ADMIN";

  // 1. Construcción dinámica de columnas
  const columns = [
    { key: "imagen", label: "IMAGEN" },
    { key: "marca", label: "MARCA" },
    { key: "modelo", label: "MODELO" },
    ...(isAdmin ? [{ key: "proveedor", label: "PROVEEDOR" }] : []),
    { key: "precio", label: "PRECIO" },
    { key: "stock", label: "STOCK" },
    { key: "acciones", label: "ACCIONES", align: "center" as const },
  ];

  // 2. Renderizado dinámico de celdas
  const renderCell = useCallback(
    (product: Product, columnKey: React.Key) => {
      switch (columnKey) {
        case "imagen":
          return (
            <div className="w-16 h-16 flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-lg p-1.5">
              <Image
                src={product.imagenUrl}
                alt={product.modelo}
                className="w-full h-full object-contain mix-blend-multiply"
                radius="none"
              />
            </div>
          );
        case "marca":
          return (
            <span className="font-medium text-zinc-500 tracking-wide text-sm">
              {product.marca}
            </span>
          );
        case "modelo":
          return (
            <span className="font-medium text-zinc-900 tracking-tight">
              {product.modelo}
            </span>
          );
        case "proveedor":
          return (
            <span className="font-medium text-zinc-600">
              {product.proveedor}
            </span>
          );
        case "precio":
          return (
            <span className="font-light text-zinc-900 tracking-tight">
              ${product.precio.toLocaleString()}
            </span>
          );
        case "stock":
          return (
            <Chip
              color={product.stock > 0 ? "default" : "danger"}
              variant="flat"
              size="sm"
              className={`font-medium tracking-wide ${
                product.stock > 0
                  ? "bg-zinc-100 text-zinc-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {product.stock} unds.
            </Chip>
          );
        case "acciones":
          if (isAdmin) {
            // Vista de solo lectura para el Administrador
            return (
              <div className="flex items-center justify-center gap-1.5 text-zinc-400">
                <Lock size={14} strokeWidth={1.5} />
                <span className="text-xs font-light tracking-wide">
                  Solo lectura
                </span>
              </div>
            );
          }
          // Vista editable para el Proveedor
          return (
            <div className="flex gap-2 justify-center">
              <Button
                isIconOnly
                color="default"
                variant="light"
                size="sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                onPress={() => onEditClick(product)}
              >
                <Pencil size={16} strokeWidth={1.5} />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="light"
                size="sm"
                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                onPress={() => onDeleteClick(product)}
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [isAdmin, onEditClick, onDeleteClick],
  );

  return (
    <Table
      aria-label="Tabla de inventario"
      removeWrapper
      classNames={{
        th: "bg-zinc-50/50 text-zinc-500 font-semibold tracking-wider text-xs px-6 py-4 border-b border-zinc-100 uppercase",
        td: "px-6 py-4 border-b border-zinc-50/80 last:border-0",
      }}
    >
      <TableHeader columns={columns}>
        {(columna: any) => (
          <TableColumn key={columna.key} align={columna.align || "start"}>
            {columna.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={products}
        emptyContent="No se encontraron celulares registrados."
      >
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
  );
};
