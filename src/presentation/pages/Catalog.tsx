// src/presentation/pages/Catalog.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { SearchX } from "lucide-react";

interface CelularMock {
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

export const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extraemos el parámetro de búsqueda
  const query = searchParams.get("q") || "";

  // Filtramos la lista basándonos en la marca o el modelo (ignorando mayúsculas)
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const queryLower = query.toLowerCase();
    return (
      product.marca.toLowerCase().includes(queryLower) ||
      product.modelo.toLowerCase().includes(queryLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {query ? `Resultados para "${query}"` : "Catálogo de Equipos"}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {query
            ? `Se encontraron ${filteredProducts.length} equipos coincidiendo con tu búsqueda.`
            : "Descubre nuestra selección de smartphones de gama alta con las mejores especificaciones del mercado."}
        </p>
      </div>

      {/* Manejo de estado vacío (Empty State) */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-100 p-6 rounded-full text-gray-400 mb-6">
            <SearchX size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No encontramos equipos
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            No hay resultados que coincidan con "{query}". Intenta buscar con
            otros términos, verifica la ortografía o navega por nuestro catálogo
            completo.
          </p>
          <Button color="primary" variant="flat" onPress={() => navigate("/")}>
            Ver todo el catálogo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="w-full flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <CardHeader className="p-0 flex-col items-center bg-gray-50 overflow-hidden rounded-t-xl h-56">
                <Image
                  alt={product.modelo}
                  className="object-contain w-full h-full p-4 hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  src={product.imagenUrl}
                  radius="none"
                  loading="lazy"
                />
              </CardHeader>

              <CardBody className="pb-2 pt-5 px-5 flex flex-col flex-1">
                <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
                  {product.marca}
                </p>
                <h4 className="font-bold text-lg text-gray-900 leading-tight mb-3 line-clamp-2">
                  {product.modelo}
                </h4>

                <div className="mt-auto">
                  <p className="text-2xl font-black text-primary">
                    $
                    {product.precio.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </CardBody>

              <CardFooter className="px-5 pb-5 pt-3">
                <Button
                  onPress={() => navigate("/producto/" + product.id)}
                  color="primary"
                  variant="bordered"
                  className="font-bold border-2 w-full"
                >
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
