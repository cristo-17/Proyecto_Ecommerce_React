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

interface CartItem {
  id: string;
  modelo: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

// Datos Mock con preferencias de usuario aplicadas a modelos exclusivos
const MOCK_CART: CartItem[] = [
  {
    id: "1",
    modelo: "Samsung Galaxy S24 Ultra - BMW M Edition",
    precio: 1450,
    cantidad: 1,
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6idTnBxqn8EtuoOsQ4xT8eviWVTdS9EVix0WzyMavj0EbgA_yRw15nxc&s=10",
  },
  {
    id: "2",
    modelo: "iPhone 15 Pro Max",
    precio: 1200,
    cantidad: 2,
    imagen:
      "https://http2.mlstatic.com/D_Q_NP_801419-MLA93327187554_092025-O.webp",
  },
];

export const Cart = () => {
  const navigate = useNavigate();
  // Simulador de estado del carrito. Para ver el estado vacío, cambia a useState<CartItem[]>([])
  const [items, setItems] = useState<CartItem[]>(MOCK_CART);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const progressToFreeShipping = Math.min((subtotal / 2000) * 100, 100);

  const handleCheckoutClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 2000);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.cantidad + delta);
          return { ...item, cantidad: newQuantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // --- ESTADO VACÍO ---
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-zinc-50 border border-zinc-100 rounded-full p-8 mb-6">
          <ShoppingBag size={64} strokeWidth={1} className="text-zinc-300" />
        </div>
        <h2 className="text-2xl font-medium text-zinc-900 mb-3 tracking-tight">
          Tu carrito está vacío
        </h2>
        <p className="text-zinc-500 font-light mb-8 max-w-sm text-center">
          Parece que aún no has agregado ningún equipo. Explora nuestro catálogo
          para encontrar el smartphone ideal para ti.
        </p>
        <Button
          onPress={() => navigate("/")}
          color="default"
          size="lg"
          className="font-medium bg-zinc-900 text-white px-8"
        >
          Ver productos
        </Button>
      </div>
    );
  }

  // --- ESTADO LLENO ---
  return (
    <div className="relative min-h-screen bg-white py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Alerta flotante superior derecha */}
      {isProcessing && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color="success"
            title="Procesando tu carrito..."
            description="Redirigiendo al pago seguro."
          />
        </div>
      )}

      <h1 className="text-3xl font-semibold text-zinc-900 mb-10 tracking-tight">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* IZQUIERDA: Lista de Productos (Aprox 65-70%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Banner de envío (Rediseño Minimalista) */}
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-5 flex items-center gap-4">
            <Truck
              size={22}
              strokeWidth={1.5}
              className="text-zinc-500 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-zinc-900 tracking-tight">
                Envío a Domicilio
              </p>
              <p className="text-sm font-light text-zinc-500 mt-0.5">
                Recibe tus productos en 24/48 horas en cualquier parte del país.
              </p>
            </div>
          </div>

          <div className="flex flex-col mt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-zinc-100 last:border-0 bg-white"
              >
                <div className="w-28 h-28 flex-shrink-0 bg-zinc-50/50 border border-zinc-100 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={item.imagen}
                    alt={item.modelo}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-zinc-900 leading-snug tracking-tight">
                    {item.modelo}
                  </h3>
                  <Chip
                    color="default"
                    variant="flat"
                    size="sm"
                    className="mt-2 mb-3 bg-zinc-100 text-zinc-600 font-medium tracking-wide"
                  >
                    Entrega rápida
                  </Chip>
                  <p className="text-xl font-light text-zinc-900">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-5 mt-4 sm:mt-0">
                  {/* Controles de Cantidad */}
                  <div className="flex items-center bg-zinc-50 border border-zinc-200/60 rounded-lg p-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-zinc-500 data-[hover=true]:bg-zinc-200/50"
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium text-sm text-zinc-900">
                      {item.cantidad}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-zinc-500 data-[hover=true]:bg-zinc-200/50"
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>

                  {/* Basurero */}
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    className="text-zinc-400 hover:text-danger hover:bg-danger-50 transition-colors"
                    onPress={() => removeItem(item.id)}
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
          <Card className="bg-zinc-50 shadow-none border border-zinc-200/60 rounded-2xl sticky top-28">
            <CardBody className="p-7">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6 tracking-tight">
                Resumen de tu pedido
              </h3>

              <div className="mb-8">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-zinc-500 font-light">
                    Para envío gratis:
                  </span>
                  <span className="font-medium text-zinc-900">
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
                    indicator: "bg-zinc-800",
                    track: "bg-zinc-200/60",
                  }}
                />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-light">Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-light">
                    Costo de Envío
                  </span>
                  <span className="font-medium text-zinc-900">
                    {subtotal >= 2000 ? "¡Gratis!" : "Calculado en checkout"}
                  </span>
                </div>
              </div>

              <Divider className="my-6 bg-zinc-200/60" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-base font-medium text-zinc-900">
                  Total
                </span>
                <span className="text-2xl font-semibold text-zinc-900 tracking-tight">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <Button
                color="default"
                size="lg"
                className="w-full font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none transition-colors"
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
