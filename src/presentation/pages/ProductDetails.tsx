// src/presentation/pages/ProductDetails.tsx
import { useState, useEffect, useCallback } from "react";
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
import { productService } from "../../infrastructure/services/productService";
import type { Product } from "../../domain/models/appCelulares.model";

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";
  const { addToCart } = useCartStore();

  // Función de carga extraída y mejorada para permitir "background fetching"
  const fetchProduct = useCallback(
    async (isBackgroundRefresh = false) => {
      if (!id) return;

      // Solo mostramos el spinner si NO es una actualización en segundo plano
      if (!isBackgroundRefresh) {
        setIsLoading(true);
      }

      setError(null);
      try {
        const data = await productService.getById(id);
        setProduct(data);

        // Solo actualizamos la imagen principal en la carga inicial para evitar parpadeos
        if (!isBackgroundRefresh) {
          if (data.imagenes && data.imagenes.length > 0) {
            setSelectedImage(data.imagenes[0]);
          } else if (data.imagenUrl) {
            setSelectedImage(data.imagenUrl);
          }
        }
      } catch (err: any) {
        if (!isBackgroundRefresh) {
          setError(err.response?.data?.message || "Producto no encontrado");
        }
      } finally {
        if (!isBackgroundRefresh) {
          setIsLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Manejador al cerrar el modal de reseñas
  const handleCloseReviews = () => {
    setIsReviewsOpen(false);
    // Refrescamos los datos en segundo plano para actualizar el contador de reseñas y estrellas
    fetchProduct(true);
  };

  // --- PANTALLA DE CARGA ESTANDARIZADA ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-default-200 border-t-foreground rounded-full animate-spin mb-4"></div>
        <p className="text-default-500 font-light text-lg">
          Cargando producto...
        </p>
      </div>
    );
  }

  // --- PANTALLA DE ERROR ESTANDARIZADA ---
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 font-sans animate-appearance-in">
        <div className="bg-default-100 p-6 rounded-full mb-2 border border-divider">
          <Package size={48} strokeWidth={1.5} className="text-default-400" />
        </div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Producto no encontrado
        </h2>
        <p className="text-default-500 font-light tracking-wide text-center max-w-md">
          {error ||
            "El equipo que buscas no existe o ha sido retirado del catálogo."}
        </p>
        <Button
          color="default"
          size="lg"
          className="mt-2 font-medium bg-foreground text-background hover:opacity-80 transition-colors shadow-none px-8"
          onPress={() => navigate("/")}
        >
          Volver a la Tienda
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        nombre: product.modelo,
        precio: product.precio,
        imagen:
          product.imagenUrl || (product.imagenes && product.imagenes[0]) || "",
        marca: product.marca,
      },
      1,
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
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

  // Construir especificaciones para la tabla
  const especificaciones = product.especificaciones || {};
  const specsArray = Object.entries(especificaciones).map(([key, value]) => ({
    caracteristica: key.charAt(0).toUpperCase() + key.slice(1),
    valor: value,
  }));

  return (
    <>
      {/* Notificación de Carrito */}
      {isAdded && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color="success"
            title="¡Agregado al carrito!"
            description="El equipo se ha añadido a tu bolsa de compras."
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-7xl animate-appearance-in">
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

            {product.imagenes && product.imagenes.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2 px-1">
                {product.imagenes.map((img: string, index: number) => (
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
            )}
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
                  {product.precio.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {product.precioAnterior && (
                  <span className="text-xl font-light text-default-400 line-through mb-1">
                    $
                    {product.precioAnterior.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>

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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= (product.promedioResenas || 0)
                        ? "fill-foreground text-foreground"
                        : "fill-default-200 text-default-200"
                    }
                  />
                ))}
                <span className="text-sm font-medium text-foreground ml-2">
                  {(product.promedioResenas || 0).toFixed(1)}
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
                Ver Reseñas ({product.totalResenas || 0})
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

            {renderActionButton()}

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

        {specsArray.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">
              Especificaciones Técnicas
            </h2>
            <div className="bg-content1 rounded-xl border border-divider overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {specsArray.map((spec, index) => (
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
        )}
      </div>

      {/* RENDERIZADO DEL MODAL CON ACTUALIZACIÓN SILENCIOSA */}
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={handleCloseReviews}
        productId={product.id}
      />
    </>
  );
};
