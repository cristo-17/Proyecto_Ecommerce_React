// src/application/hooks/useCatalogFilters.ts
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Movimos la interfaz y el Mock Data aquí para que la capa de aplicación sea
// la dueña de la gestión de los datos (simulando una llamada a un servicio/API).
export interface CelularMock {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  imagenUrl: string;
}

const MOCK_PRODUCTS: CelularMock[] = [
  {
    id: "cel-001",
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra - BMW M Edition",
    precio: 1450.0,
    imagenUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6idTnBxqn8EtuoOsQ4xT8eviWVTdS9EVix0WzyMavj0EbgA_yRw15nxc&s=10",
  },
  {
    id: "cel-002",
    marca: "Apple",
    modelo: "iPhone 15 Pro Max",
    precio: 1299.99,
    imagenUrl:
      "https://http2.mlstatic.com/D_Q_NP_801419-MLA93327187554_092025-O.webp",
  },
  {
    id: "cel-003",
    marca: "Google",
    modelo: "Pixel 8 Pro",
    precio: 999.0,
    imagenUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYgGhIm2DEw1NUtWAXF0G91N4MrZ3XCu0s-lG0EXuOKppq3_4RAQnQj4&s=10",
  },
  {
    id: "cel-004",
    marca: "Xiaomi",
    modelo: "14 Ultra",
    precio: 1199.5,
    imagenUrl:
      "https://http2.mlstatic.com/D_NQ_NP_788031-MLU77409006804_072024-O.webp",
  },
];

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Estados locales gestionados por el Hook
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);

  // Sincronización bidireccional si el usuario busca desde el Navbar
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
  }, [searchParams]);

  // Actualizador de búsqueda que también limpia los params de la URL
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setSearchParams(
      (prev) => {
        if (value) prev.set("q", value);
        else prev.delete("q");
        return prev;
      },
      { replace: true }
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (value: number | number[]) => {
    setPriceRange(value as number[]);
  };

  // Motor de filtrado
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Filtro por Búsqueda (Marca o Modelo)[cite: 22]
      const queryLower = searchTerm.toLowerCase();
      const matchesSearch =
        product.marca.toLowerCase().includes(queryLower) ||
        product.modelo.toLowerCase().includes(queryLower);

      // 2. Filtro por Marca (si no hay ninguna seleccionada, pasan todas)
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.marca);

      // 3. Filtro por Rango de Precios
      const matchesPrice =
        product.precio >= priceRange[0] && product.precio <= priceRange[1];

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [searchTerm, selectedBrands, priceRange]);

  return {
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange: handlePriceChange,
    filteredProducts,
  };
};