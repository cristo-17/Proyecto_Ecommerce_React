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
            <Image
              src={product.imagenUrl}
              alt={product.modelo}
              className="w-16 h-16 object-contain bg-white rounded-lg border border-gray-200 min-w-[64px]"
            />
          );
        case "marca":
          return (
            <span className="font-semibold text-gray-600">{product.marca}</span>
          );
        case "modelo":
          return (
            <span className="font-bold text-gray-900">{product.modelo}</span>
          );
        case "proveedor":
          return (
            <span className="font-medium text-primary">
              {product.proveedor}
            </span>
          );
        case "precio":
          return (
            <span className="font-medium text-success">
              ${product.precio.toLocaleString()}
            </span>
          );
        case "stock":
          return (
            <Chip
              color={product.stock > 0 ? "success" : "danger"}
              variant="flat"
              size="sm"
              className="font-bold"
            >
              {product.stock} unds.
            </Chip>
          );
        case "acciones":
          if (isAdmin) {
            // Vista de solo lectura para el Administrador
            return (
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <Lock size={14} />
                <span className="text-xs font-semibold">Solo lectura</span>
              </div>
            );
          }
          // Vista editable para el Proveedor
          return (
            <div className="flex gap-2 justify-center">
              <Button
                isIconOnly
                color="primary"
                variant="flat"
                size="sm"
                onPress={() => onEditClick(product)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => onDeleteClick(product)}
              >
                <Trash2 size={16} />
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
    <Table aria-label="Tabla de inventario" removeWrapper>
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
            className="hover:bg-gray-50 transition-colors"
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
