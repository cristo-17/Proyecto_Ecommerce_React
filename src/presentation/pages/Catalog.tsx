// src/presentation/pages/Catalog.tsx
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

// 1. Definición del Tipo para el Mock Data
interface CelularMock {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  imagenUrl: string;
}

// 2. Mock Data: Catálogo de productos de prueba
const MOCK_PRODUCTS: CelularMock[] = [
  {
    id: "cel-001",
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra - BMW M Edition",
    precio: 1450.0,
    imagenUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzYIL0_TCTRoz9A60G6g99yx6tOtYPooFGH4XrU7kn9vfKDGBEoZt67x0&s=10",
  },
  {
    id: "cel-002",
    marca: "Apple",
    modelo: "iPhone 15 Pro Max",
    precio: 1299.99,
    imagenUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cel-003",
    marca: "Google",
    modelo: "Pixel 8 Pro",
    precio: 999.0,
    imagenUrl:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cel-004",
    marca: "Xiaomi",
    modelo: "14 Ultra",
    precio: 1199.5,
    imagenUrl:
      "https://images.unsplash.com/photo-1712244654559-67ce42211ea1?q=80&w=800&auto=format&fit=crop",
  },
];

export const Catalog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado del Catálogo */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Catálogo de Equipos
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Descubre nuestra selección de smartphones de gama alta con las mejores
          especificaciones del mercado.
        </p>
      </div>

      {/* Grilla Responsiva de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <Card
            key={product.id}
            className="w-full flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
          >
            {/* Cabecera del Card: Imagen */}
            <CardHeader className="p-0 flex-col items-center bg-gray-50 overflow-hidden rounded-t-xl h-56">
              <Image
                alt={product.modelo}
                className="object-contain w-full h-full p-4 hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                src={product.imagenUrl}
                radius="none"
                loading="lazy"
              />
            </CardHeader>

            {/* Cuerpo del Card: Información */}
            <CardBody className="pb-2 pt-5 px-5 flex flex-col flex-1">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
                {product.marca}
              </p>
              <h4 className="font-bold text-lg text-gray-900 leading-tight mb-3 line-clamp-2">
                {product.modelo}
              </h4>

              {/* Spacer para empujar el precio siempre al fondo si el título es corto */}
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

            {/* Pie del Card: Botón de Acción */}
            <CardFooter className="px-5 pb-5 pt-3">
              <Button
                as={Link}
                to={`/celular/${product.id}`}
                color="primary"
                variant="solid"
                className="w-full font-bold shadow-md shadow-primary/20"
                size="lg"
              >
                Ver detalles
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
