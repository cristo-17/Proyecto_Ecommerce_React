// src/presentation/pages/Cart.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Alert } from "@heroui/alert";
import { Divider } from "@heroui/divider";
import { Truck, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../application/store/useCartStore";
import { productService } from "../../infrastructure/services/productService";

export const Cart = () => {
  const navigate = useNavigate();

  // Consumo del estado global (Zustand)
  const { items, updateQuantity, removeFromCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  // Nuevo estado para mostrar que la validación fue exitosa
  const [isSuccess, setIsSuccess] = useState(false); 

  // Cálculo en tiempo real basado en el estado de Zustand
  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0,
  );

  const progressToFreeShipping = Math.min((subtotal / 2000) * 100, 100);

  const handleCheckoutClick = async () => {
    setStockError(null);
    setIsProcessing(true);
    setIsSuccess(false);

    try {
      // Verificar stock de cada producto contra el backend
      for (const item of items) {
        const product = await productService.getById(String(item.id));
        if (product.stock < item.quantity) {
          setStockError(
            `"${product.modelo}" solo tiene ${product.stock} unidades disponibles. Por favor ajusta la cantidad.`,
          );
          setIsProcessing(false);
          return;
        }
      }

      // Si todo está bien, mostramos el estado de éxito y navegamos con un pequeño retraso (UX del diseño original)
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/checkout");
      }, 1500);
      
    } catch (error: any) {
      setStockError(
        error.response?.data?.message ||
          "Error al verificar el stock. Inténtalo de nuevo.",
      );
      setIsProcessing(false);
    }
  };

  // --- ESTADO VACÍO ---
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-default-50 border border-divider rounded-full p-8 mb-6">
          <ShoppingBag size={64} strokeWidth={1} className="text-default-400" />
        </div>
        <h2 className="text-2xl font-medium text-foreground mb-3 tracking-tight">
          Tu carrito está vacío
        </h2>
        <p className="text-default-500 font-light mb-8 max-w-sm text-center">
          Parece que aún no has agregado ningún equipo. Explora nuestro catálogo
          para encontrar el smartphone ideal para ti.
        </p>
        <Button
          onPress={() => navigate("/")}
          color="default"
          size="lg"
          className="font-medium bg-foreground text-background hover:opacity-80 px-8"
        >
          Ver productos
        </Button>
      </div>
    );
  }

  // --- ESTADO LLENO ---
  return (
    <div className="relative min-h-screen py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      
      {/* Contenedor de Alertas Flotantes (Soporta Error y Éxito) */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {stockError && (
          <div className="animate-appearance-in">
            <Alert
              color="danger"
              title="Error de stock"
              description={stockError}
            />
          </div>
        )}

        {isSuccess && (
          <div className="animate-appearance-in">
            <Alert
              color="success"
              title="Procesando tu carrito..."
              description="Redirigiendo al pago seguro."
            />
          </div>
        )}
      </div>

      <h1 className="text-3xl font-semibold text-foreground mb-10 tracking-tight">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* IZQUIERDA: Lista de Productos (Aprox 65-70%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Banner de envío (Rediseño Minimalista) */}
          <div className="bg-content1 border border-divider rounded-xl p-5 flex items-center gap-4">
            <Truck
              size={22}
              strokeWidth={1.5}
              className="text-default-500 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-foreground tracking-tight">
                Envío a Domicilio
              </p>
              <p className="text-sm font-light text-default-500 mt-0.5">
                Recibe tus productos en 24/48 horas en cualquier parte del país.
              </p>
            </div>
          </div>

          <div className="flex flex-col mt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-divider last:border-0 bg-content1 px-4 sm:px-0 rounded-lg sm:rounded-none"
              >
                <div className="w-28 h-28 flex-shrink-0 bg-default-50 border border-divider rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-foreground leading-snug tracking-tight">
                    {item.nombre}
                  </h3>
                  <Chip
                    color="default"
                    variant="flat"
                    size="sm"
                    className="mt-2 mb-3 bg-default-100 text-default-500 font-medium tracking-wide"
                  >
                    Entrega rápida
                  </Chip>
                  <p className="text-xl font-light text-foreground">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-5 mt-4 sm:mt-0">
                  {/* Controles de Cantidad */}
                  <div className="flex items-center bg-default-50 border border-divider rounded-lg p-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-500 data-[hover=true]:bg-default-200"
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium text-sm text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-500 data-[hover=true]:bg-default-200"
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  {/* Basurero */}
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    className="text-default-400 hover:text-danger hover:bg-danger/20 transition-colors"
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={20} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA: Resumen (Aprox 30-35%) */}
        <div className="lg:col-span-4">
          <Card className="bg-content1 shadow-none border border-divider rounded-2xl sticky top-28">
            <CardBody className="p-7">
              <h3 className="text-lg font-semibold text-foreground mb-6 tracking-tight">
                Resumen de tu pedido
              </h3>

              <div className="mb-8">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-default-500 font-light">
                    Para envío gratis:
                  </span>
                  <span className="font-medium text-foreground">
                    Faltan $
                    {(2000 - subtotal > 0
                      ? 2000 - subtotal
                      : 0
                    ).toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={progressToFreeShipping}
                  color="default"
                  size="sm"
                  classNames={{
                    indicator: "bg-foreground",
                    track: "bg-default-200",
                  }}
                />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-500 font-light">Subtotal</span>
                  <span className="font-medium text-foreground">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500 font-light">
                    Costo de Envío
                  </span>
                  <span className="font-medium text-foreground">
                    {subtotal >= 2000 ? "¡Gratis!" : "Calculado en checkout"}
                  </span>
                </div>
              </div>

              <Divider className="my-6 bg-divider" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-base font-medium text-foreground">
                  Total
                </span>
                <span className="text-2xl font-semibold text-foreground tracking-tight">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <Button
                color="default"
                size="lg"
                className="w-full font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
                onPress={handleCheckoutClick}
                isLoading={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Proceder al Pago"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};