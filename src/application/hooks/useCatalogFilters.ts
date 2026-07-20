import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../../infrastructure/services/productService";
import type { Product } from "../../domain/models/appCelulares.model";

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. ESTADOS DE LA URL (Lo que lee el backend)
  const q = searchParams.get("q") || "";
  const marca = searchParams.get("marca")?.split(",") || [];
  const precioMin = searchParams.get("precioMin")
    ? Number(searchParams.get("precioMin"))
    : undefined;
  const precioMax = searchParams.get("precioMax")
    ? Number(searchParams.get("precioMax"))
    : undefined;

  // 2. NUEVO: ESTADOS LOCALES (Lo que ve el usuario instantáneamente)
  const [localSearch, setLocalSearch] = useState(q);
  const [localPriceRange, setLocalPriceRange] = useState<number[]>([
    precioMin || 0,
    precioMax || 2000,
  ]);

  // Estados de carga y datos
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // 3. NUEVO: Lógica de Debounce (Espera 500ms tras dejar de escribir/deslizar)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== q) {
        setSearchParams((prev) => {
          if (localSearch) prev.set("q", localSearch);
          else prev.delete("q");
          return prev;
        });
        setCurrentPage(0);
      }
    }, 500); // 500ms de retraso

    return () => clearTimeout(handler);
  }, [localSearch, q, setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localPriceRange[0] !== (precioMin || 0) ||
        localPriceRange[1] !== (precioMax || 2000)
      ) {
        setSearchParams((prev) => {
          prev.set("precioMin", String(localPriceRange[0]));
          prev.set("precioMax", String(localPriceRange[1]));
          return prev;
        });
        setCurrentPage(0);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localPriceRange, precioMin, precioMax, setSearchParams]);

  // Consumo del backend (se mantiene intacto)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        q: q || undefined,
        marca: marca.length ? marca : undefined,
        precioMin,
        precioMax,
        page: currentPage,
        size: 20,
      };
      const response = await productService.getCatalog(filters);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  }, [q, marca.join(","), precioMin, precioMax, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Toggle de marca (es un click, así que va directo a la URL)
  const toggleBrand = (brand: string) => {
    setSearchParams((prev) => {
      const currentMarcas = prev.get("marca")?.split(",") || [];
      if (currentMarcas.includes(brand)) {
        const newMarcas = currentMarcas.filter((b) => b !== brand);
        if (newMarcas.length) prev.set("marca", newMarcas.join(","));
        else prev.delete("marca");
      } else {
        prev.set("marca", [...currentMarcas, brand].join(","));
      }
      return prev;
    });
    setCurrentPage(0);
  };

  return {
    // Retornamos los estados locales para que la UI no se trabe
    searchTerm: localSearch,
    setSearchTerm: setLocalSearch,
    priceRange: localPriceRange,
    setPriceRange: setLocalPriceRange,

    // Retornamos el resto normalmente
    selectedBrands: marca,
    toggleBrand,
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
