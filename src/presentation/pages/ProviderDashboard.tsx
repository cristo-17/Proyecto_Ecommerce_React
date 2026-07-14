// src/presentation/pages/ProviderDashboard.tsx
import { useState } from "react";
import { Button } from "@heroui/button";
import { ProviderInventoryTable } from "../components/provider/ProviderInventoryTable";
import { ProviderProductModal } from "../components/provider/ProviderProductModal";
import { ProviderDeleteModal } from "../components/provider/ProviderDeleteModal";
import type { Product } from "../../domain/models/appCelulares.model";

// 2. Mock Data actualizado
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

export const ProviderDashboard = () => {
  // LECTURA DE ROL
  const userRole = localStorage.getItem("user_role") || "INVITADO";
  const currentUserCompany = "Samsung Global"; // Simulación de empresa del proveedor logueado

  // Filtramos la data: El Admin ve todo, el Proveedor solo lo suyo
  const displayedProducts =
    userRole === "ADMIN"
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.proveedor === currentUserCompany);

  const [products, setProducts] = useState<Product[]>(displayedProducts);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- MANEJADORES ---
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

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-2xl border border-zinc-200/60 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-zinc-900 tracking-tight">
            {userRole === "ADMIN" ? "Inventario Global" : "Mi Inventario"}
          </h1>
          <p className="text-zinc-500 font-light mt-2 tracking-wide">
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
            className="font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none transition-colors"
          >
            + Publicar Nuevo Equipo
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 overflow-hidden">
        {/* Pasamos el rol a la tabla */}
        <ProviderInventoryTable
          products={products}
          role={userRole}
          onEditClick={handleOpenEdit}
          onDeleteClick={handleOpenDelete}
        />
      </div>

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
