// src/presentation/pages/ProductDetails.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Alert } from "@heroui/alert";
import { MessageSquare, Star } from "lucide-react";
import {
  Zap,
  Package,
  ShoppingCart,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { ReviewsModal } from "../components/reviews/ReviewsModal";
import { useCartStore } from "../../application/store/useCartStore";
import { useAuthStore } from "../../application/store/useAuthStore";

const MOCK_PRODUCTS = [
  {
    id: "cel-001",
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra - BMW M Edition",
    precioActual: 1450,
    precioAnterior: 1600,
    stock: 15,
    imagenes: [
      "https://images.samsung.com/is/image/samsung/assets/pe/s2602/pcd/smartphones/PCD_Galaxy-S-KV_S26-Series_MO_720x1080.jpg?$720_1080_JPG$",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop",
      "https://images.samsung.com/is/image/samsung/p6pim/pe/sm-a075mzkeltp/gallery/pe-galaxy-a07-sm-a075-sm-a075mzkeltp-thumb-549150429",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800&auto=format&fit=crop",
    ],
    descripcion:
      "La máxima expresión de tecnología y diseño. El Galaxy S24 Ultra edición exclusiva cuenta con un acabado premium inspirado en la ingeniería automotriz de alto rendimiento, marcos de titanio y el poderoso S Pen integrado.",
    especificaciones: [
      { caracteristica: "Procesador", valor: "Snapdragon 8 Gen 3 for Galaxy" },
      { caracteristica: "RAM", valor: "12 GB LPDDR5X" },
      { caracteristica: "Almacenamiento", valor: "512 GB UFS 4.0" },
      { caracteristica: "Batería", valor: "5000 mAh (Carga Rápida 45W)" },
      {
        caracteristica: "Pantalla",
        valor: '6.8" QHD+ Dynamic AMOLED 2X (120Hz)',
      },
    ],
  },
  {
    id: "cel-002",
    marca: "Apple",
    modelo: "iPhone 15 Pro Max",
    precioActual: 1299.99,
    precioAnterior: 1499.0,
    stock: 2,
    imagenes: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    ],
    descripcion:
      "Diseñado en titanio aeroespacial. El iPhone 15 Pro Max incluye el revolucionario chip A17 Pro, un botón de acción personalizable y el sistema de cámaras más potente en un iPhone hasta ahora con zoom óptico de 5x.",
    especificaciones: [
      { caracteristica: "Procesador", valor: "Chip A17 Pro" },
      { caracteristica: "RAM", valor: "8 GB" },
      { caracteristica: "Almacenamiento", valor: "256 GB NVMe" },
      { caracteristica: "Batería", valor: "4422 mAh (MagSafe 15W)" },
      {
        caracteristica: "Pantalla",
        valor: '6.7" Super Retina XDR OLED (120Hz)',
      },
    ],
  },
  {
    id: "cel-003",
    marca: "Google",
    modelo: "Pixel 8 Pro",
    precioActual: 999.0,
    precioAnterior: 1150.0,
    stock: 0,
    imagenes: [
      "https://images.unsplash.com/photo-1696446700622-48df1ab53744?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=800&auto=format&fit=crop",
    ],
    descripcion:
      "El poder de la IA de Google en tus manos. Con el Pixel 8 Pro tendrás fotos y videos impresionantes, un diseño elegante en colores mate y la experiencia de Android más pura, fluida y con 7 años de actualizaciones.",
    especificaciones: [
      { caracteristica: "Procesador", valor: "Google Tensor G3" },
      { caracteristica: "RAM", valor: "12 GB LPDDR5X" },
      { caracteristica: "Almacenamiento", valor: "128 GB UFS 3.1" },
      { caracteristica: "Batería", valor: "5050 mAh (Carga Inalámbrica)" },
      {
        caracteristica: "Pantalla",
        valor: '6.7" LTPO OLED (120Hz HDR10+)',
      },
    ],
  },
];

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Buscar el producto dinámicamente
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  const [selectedImage, setSelectedImage] = useState(
    product?.imagenes[0] || "",
  );

  // Actualizar la imagen seleccionada cuando cambia la ruta o el producto
  useEffect(() => {
    if (product) {
      setSelectedImage(product.imagenes[0]);
    }
  }, [product]);

  // Estado para el Modal de Reseñas
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Estado para la alerta de Agregar al Carrito
  const [isAdded, setIsAdded] = useState(false);

  // 1. Corrección del Bug de Autenticación (Zustand)
  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";

  // Extrae la función del store
  const { addToCart } = useCartStore();

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 font-sans">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Producto no encontrado
        </h2>
        <p className="text-default-500 font-light tracking-wide text-center">
          El equipo que buscas no existe o ha sido retirado del catálogo.
        </p>
        <Button
          color="default"
          size="lg"
          className="mt-2 font-medium bg-foreground text-background hover:opacity-80 transition-colors shadow-none"
          onPress={() => navigate("/")}
        >
          Volver al Catálogo
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Inyección de la lógica de Zustand mapeando el producto actual
    addToCart(
      {
        id: product.id,
        nombre: product.modelo,
        precio: product.precioActual,
        imagen: product.imagenes[0],
        marca: product.marca,
      },
      1, // Cantidad por defecto a agregar
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  const renderActionButton = () => {
    switch (userRole) {
      case "INVITADO":
        return (
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onPress={() => navigate("/login")}
              color="default"
              size="lg"
              variant="flat"
              className="w-full h-16 text-lg font-medium bg-default-200 text-foreground hover:bg-default-300 transition-colors"
            >
              Iniciar sesión para comprar
            </Button>
            <p className="text-center text-sm text-default-500 font-light tracking-wide">
              Regístrate de forma segura para adquirir este equipo.
            </p>
          </div>
        );

      case "CLIENTE":
        if (product.stock === 0) {
          return (
            <Button
              isDisabled
              color="default"
              size="lg"
              className="w-full h-16 text-lg font-medium bg-default-100 text-default-400 transition-colors shadow-none mt-6"
            >
              Producto Agotado
            </Button>
          );
        }
        return (
          <Button
            onPress={handleAddToCart}
            color="default"
            size="lg"
            className="w-full h-16 text-lg font-medium bg-foreground text-background hover:opacity-80 transition-colors shadow-none mt-6"
            startContent={<ShoppingCart size={22} strokeWidth={1.5} />}
          >
            Agregar al carrito
          </Button>
        );

      case "PROVEEDOR":
      case "ADMIN":
        return (
          <div className="mt-6">
            <Button
              isDisabled
              size="lg"
              variant="flat"
              className="w-full h-16 text-md font-medium bg-default-50 text-default-400 shadow-none"
            >
              Modo visualización (Solo clientes pueden comprar)
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Alerta flotante superior derecha */}
      {isAdded && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color="success"
            title="¡Agregado al carrito!"
            description="El equipo se ha añadido a tu bolsa de compras."
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* COLUMNA IZQUIERDA: Galería de Imágenes */}
          <div className="flex flex-col gap-6">
            <div className="w-full bg-default-50 rounded-xl border border-divider overflow-hidden flex justify-center items-center p-8">
              <Image
                src={selectedImage}
                alt={product.modelo}
                className="object-contain w-full h-[500px]"
                radius="none"
                loading="lazy"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto py-2 px-1">
              {product.imagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === img
                      ? "border-foreground opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="object-cover w-20 h-20 bg-default-50"
                    radius="none"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Información y Acción */}
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <p className="text-xs font-semibold text-default-400 uppercase tracking-widest mb-3">
                {product.marca}
              </p>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                {product.modelo}
              </h1>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-end gap-4">
                <span className="text-4xl font-light text-foreground tracking-tight">
                  $
                  {product.precioActual.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xl font-light text-default-400 line-through mb-1">
                  $
                  {product.precioAnterior.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* BADGES DE STOCK */}
              <div className="flex items-center mt-1">
                {product.stock === 0 ? (
                  <Chip
                    color="danger"
                    variant="flat"
                    size="sm"
                    className="font-medium"
                  >
                    Agotado
                  </Chip>
                ) : product.stock <= 3 ? (
                  <Chip
                    color="warning"
                    variant="flat"
                    size="sm"
                    className="font-medium"
                  >
                    ¡Últimas {product.stock} unidades!
                  </Chip>
                ) : (
                  <Chip
                    color="success"
                    variant="flat"
                    size="sm"
                    className="font-medium"
                  >
                    Stock disponible
                  </Chip>
                )}
              </div>
            </div>

            {/* BOTÓN DE RESEÑAS INTEGRADO */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="fill-foreground text-foreground w-4 h-4" />
                <Star className="fill-foreground text-foreground w-4 h-4" />
                <Star className="fill-foreground text-foreground w-4 h-4" />
                <Star className="fill-foreground text-foreground w-4 h-4" />
                <Star className="fill-default-200 text-default-200 w-4 h-4" />
                <span className="text-sm font-medium text-foreground ml-2">
                  4.8
                </span>
              </div>
              <Button
                variant="light"
                color="default"
                size="sm"
                className="font-medium text-default-500 hover:text-foreground"
                startContent={<MessageSquare size={16} strokeWidth={1.5} />}
                onPress={() => setIsReviewsOpen(true)}
              >
                Ver Reseñas (3)
              </Button>
            </div>

            <div className="flex gap-3">
              <Chip
                color="default"
                variant="bordered"
                size="md"
                className="font-medium text-default-500 border-divider bg-content1"
                startContent={<Zap size={14} className="text-default-500" />}
              >
                Entrega rápida
              </Chip>
              <Chip
                color="default"
                variant="bordered"
                size="md"
                className="font-medium text-default-500 border-divider bg-content1"
                startContent={
                  <Package size={14} className="text-default-500" />
                }
              >
                Envío GRATIS
              </Chip>
            </div>

            <p className="text-default-500 font-light leading-relaxed tracking-wide">
              {product.descripcion}
            </p>

            {/* Acción Condicional */}
            {renderActionButton()}

            {/* Garantía */}
            <div className="flex flex-col gap-4 mt-6 p-5 bg-default-50 rounded-xl border border-divider">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  strokeWidth={1.5}
                  className="text-default-500 flex-shrink-0"
                />
                <p className="text-sm text-default-500 font-light">
                  Garantía oficial de 12 meses con la marca.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard
                  size={20}
                  strokeWidth={1.5}
                  className="text-default-500 flex-shrink-0"
                />
                <p className="text-sm text-default-500 font-light">
                  Aceptamos todas las tarjetas de crédito y billeteras
                  digitales.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-16 bg-divider" />

        {/* ESPECIFICACIONES */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">
            Especificaciones Técnicas
          </h2>
          <div className="bg-content1 rounded-xl border border-divider overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                {product.especificaciones.map((spec, index) => (
                  <tr
                    key={index}
                    className="border-b border-divider last:border-0 even:bg-default-50 hover:bg-default-100 transition-colors"
                  >
                    <th className="py-4 px-6 font-medium text-default-500 w-1/3 border-r border-divider">
                      {spec.caracteristica}
                    </th>
                    <td className="py-4 px-6 text-default-500 font-light">
                      {spec.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        productId={product.id}
      />
    </>
  );
};
