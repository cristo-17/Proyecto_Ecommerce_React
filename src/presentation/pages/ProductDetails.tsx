// src/presentation/pages/ProductDetails.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const MOCK_PRODUCT = {
  id: "cel-001",
  marca: "Samsung",
  modelo: "Galaxy S24 Ultra - BMW M Edition",
  precioActual: 1450,
  precioAnterior: 1600,
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
};

export const ProductDetails = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(MOCK_PRODUCT.imagenes[0]);

  // Estado para el Modal de Reseñas
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Estado para la alerta de Agregar al Carrito
  const [isAdded, setIsAdded] = useState(false);

  // Lectura del rol actual de la sesión
  const userRole = localStorage.getItem("user_role") || "INVITADO";

  const handleAddToCart = () => {
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
              className="w-full h-16 text-lg font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              Iniciar sesión para comprar
            </Button>
            <p className="text-center text-sm text-zinc-500 font-light tracking-wide">
              Regístrate de forma segura para adquirir este equipo.
            </p>
          </div>
        );

      case "CLIENTE":
        return (
          <Button
            onPress={handleAddToCart}
            color="default"
            size="lg"
            className="w-full h-16 text-lg font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-none mt-6"
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
              className="w-full h-16 text-md font-medium bg-zinc-50 text-zinc-400 shadow-none"
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
            <div className="w-full bg-zinc-50/50 rounded-xl border border-zinc-100 overflow-hidden flex justify-center items-center p-8">
              <Image
                src={selectedImage}
                alt={MOCK_PRODUCT.modelo}
                className="object-contain w-full h-[500px]"
                radius="none"
                loading="lazy"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto py-2 px-1">
              {MOCK_PRODUCT.imagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === img
                      ? "border-zinc-900 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="object-cover w-20 h-20 bg-zinc-50"
                    radius="none"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Información y Acción */}
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                {MOCK_PRODUCT.marca}
              </p>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 leading-tight tracking-tight">
                {MOCK_PRODUCT.modelo}
              </h1>
            </div>

            <div className="flex items-end gap-4 mt-2">
              <span className="text-4xl font-light text-zinc-900 tracking-tight">
                ${MOCK_PRODUCT.precioActual.toLocaleString()}
              </span>
              <span className="text-xl font-light text-zinc-400 line-through mb-1">
                ${MOCK_PRODUCT.precioAnterior.toLocaleString()}
              </span>
            </div>

            {/* BOTÓN DE RESEÑAS INTEGRADO */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="fill-zinc-800 text-zinc-800 w-4 h-4" />
                <Star className="fill-zinc-800 text-zinc-800 w-4 h-4" />
                <Star className="fill-zinc-800 text-zinc-800 w-4 h-4" />
                <Star className="fill-zinc-800 text-zinc-800 w-4 h-4" />
                <Star className="fill-zinc-200 text-zinc-200 w-4 h-4" />
                <span className="text-sm font-medium text-zinc-900 ml-2">
                  4.8
                </span>
              </div>
              <Button
                variant="light"
                color="default"
                size="sm"
                className="font-medium text-zinc-500 hover:text-zinc-900"
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
                className="font-medium text-zinc-600 border-zinc-200 bg-white"
                startContent={<Zap size={14} className="text-zinc-500" />}
              >
                Entrega rápida
              </Chip>
              <Chip
                color="default"
                variant="bordered"
                size="md"
                className="font-medium text-zinc-600 border-zinc-200 bg-white"
                startContent={<Package size={14} className="text-zinc-500" />}
              >
                Envío GRATIS
              </Chip>
            </div>

            <p className="text-zinc-500 font-light leading-relaxed tracking-wide">
              {MOCK_PRODUCT.descripcion}
            </p>

            {/* Acción Condicional */}
            {renderActionButton()}

            {/* Garantía */}
            <div className="flex flex-col gap-4 mt-6 p-5 bg-zinc-50/50 rounded-xl border border-zinc-200/60">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  strokeWidth={1.5}
                  className="text-zinc-500 flex-shrink-0"
                />
                <p className="text-sm text-zinc-600 font-light">
                  Garantía oficial de 12 meses con la marca.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard
                  size={20}
                  strokeWidth={1.5}
                  className="text-zinc-500 flex-shrink-0"
                />
                <p className="text-sm text-zinc-600 font-light">
                  Aceptamos todas las tarjetas de crédito y billeteras
                  digitales.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-16 bg-zinc-100" />

        {/* ESPECIFICACIONES */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8 tracking-tight">
            Especificaciones Técnicas
          </h2>
          <div className="bg-white rounded-xl border border-zinc-200/60 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                {MOCK_PRODUCT.especificaciones.map((spec, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-100 last:border-0 even:bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
                  >
                    <th className="py-4 px-6 font-medium text-zinc-700 w-1/3 border-r border-zinc-100">
                      {spec.caracteristica}
                    </th>
                    <td className="py-4 px-6 text-zinc-500 font-light">
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
        productId={MOCK_PRODUCT.id}
      />
    </>
  );
};
