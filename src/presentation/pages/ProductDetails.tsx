// src/presentation/pages/ProductDetails.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { MessageSquare, Star } from "lucide-react";
import { Zap, Package } from "lucide-react";
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

  // Lectura del rol actual de la sesión
  const userRole = localStorage.getItem("user_role") || "INVITADO";

  const renderActionButton = () => {
    switch (userRole) {
      case "INVITADO":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <Button
              onPress={() => navigate("/login")}
              color="default"
              size="lg"
              className="w-full h-16 text-lg font-bold shadow-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Iniciar sesión para comprar
            </Button>
            <p className="text-center text-sm text-gray-500 font-medium">
              Regístrate de forma segura para adquirir este equipo.
            </p>
          </div>
        );

      case "CLIENTE":
        return (
          <Button
            color="primary"
            size="lg"
            className="w-full h-16 text-lg font-bold shadow-lg shadow-primary/30 mt-4"
          >
            🛒 Agregar al carrito
          </Button>
        );

      case "PROVEEDOR":
      case "ADMIN":
        return (
          <div className="mt-4">
            <Button
              isDisabled
              size="lg"
              className="w-full h-16 text-md font-semibold bg-gray-100 text-gray-400"
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* COLUMNA IZQUIERDA: Galería de Imágenes */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden flex justify-center items-center p-4">
              <Image
                src={selectedImage}
                alt={MOCK_PRODUCT.modelo}
                className="object-contain w-full h-[450px]"
                radius="lg"
                loading="lazy"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto py-2">
              {MOCK_PRODUCT.imagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedImage === img
                      ? "border-primary shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="object-cover w-20 h-20 bg-white"
                    radius="none"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Información y Acción */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {MOCK_PRODUCT.marca}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {MOCK_PRODUCT.modelo}
              </h1>
            </div>

            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-primary">
                ${MOCK_PRODUCT.precioActual.toLocaleString()}
              </span>
              <span className="text-xl text-gray-400 line-through mb-1">
                ${MOCK_PRODUCT.precioAnterior.toLocaleString()}
              </span>
            </div>

            {/* BOTÓN DE RESEÑAS INTEGRADO */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="fill-warning text-warning w-5 h-5" />
                <Star className="fill-warning text-warning w-5 h-5" />
                <Star className="fill-warning text-warning w-5 h-5" />
                <Star className="fill-warning text-warning w-5 h-5" />
                <Star className="fill-warning text-warning w-5 h-5 opacity-50" />
                <span className="text-sm font-bold ml-1">4.8</span>
              </div>
              <Button
                variant="light"
                color="primary"
                size="sm"
                className="font-medium"
                startContent={<MessageSquare size={16} />}
                onPress={() => setIsReviewsOpen(true)}
              >
                Ver Reseñas (3)
              </Button>
            </div>

            <div className="flex gap-3">
              <Chip
                color="success"
                variant="flat"
                size="md"
                className="font-medium"
                startContent={<Zap size={16} />}
              >
                Entrega rápida
              </Chip>
              <Chip
                color="secondary"
                variant="flat"
                size="md"
                className="font-medium"
                startContent={<Package size={16} />}
              >
                Envío GRATIS
              </Chip>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {MOCK_PRODUCT.descripcion}
            </p>

            {/* Acción Condicional */}
            {renderActionButton()}

            {/* Garantía */}
            <div className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <p className="text-sm text-gray-700">
                  Garantía oficial de 12 meses con la marca.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💳</span>
                <p className="text-sm text-gray-700">
                  Aceptamos todas las tarjetas de crédito y billeteras
                  digitales.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* ESPECIFICACIONES */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Especificaciones Técnicas
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                {MOCK_PRODUCT.especificaciones.map((spec, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 last:border-0 even:bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 border-r border-gray-200">
                      {spec.caracteristica}
                    </th>
                    <td className="py-3 px-4 text-gray-600">{spec.valor}</td>
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
