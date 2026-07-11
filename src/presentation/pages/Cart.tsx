// src/presentation/pages/Cart.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Alert } from "@heroui/alert";
import { Divider } from "@heroui/divider";

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
    imagen: "https://via.placeholder.com/150?text=S24+BMW",
  },
  {
    id: "2",
    modelo: "iPhone 15 Pro Max",
    precio: 1200,
    cantidad: 2,
    imagen: "https://via.placeholder.com/150?text=iPhone+15",
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8">
        <svg
          className="w-24 h-24 text-gray-300 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tu carrito está vacío
        </h2>
        <Button
          onPress={() => navigate("/")}
          color="primary"
          size="lg"
          className="font-semibold"
        >
          Ver productos
        </Button>
      </div>
    );
  }

  // --- ESTADO LLENO ---
  return (
    <div className="relative min-h-screen bg-gray-50 p-4 lg:p-8">
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* IZQUIERDA: Lista de Productos (70%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardBody className="p-4 flex flex-row items-center gap-3">
              <span className="text-xl">🚚</span>
              <div>
                <p className="font-semibold text-gray-800">Envío a Domicilio</p>
                <p className="text-sm text-gray-500">
                  Recibe tus productos en 24/48 horas.
                </p>
              </div>
            </CardBody>
          </Card>

          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-white shadow-sm border border-gray-100"
            >
              <CardBody className="p-4 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={item.imagen}
                  alt={item.modelo}
                  className="w-24 h-24 object-contain bg-gray-100 rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.modelo}
                  </h3>
                  <Chip
                    color="success"
                    variant="flat"
                    size="sm"
                    className="mt-1 mb-2"
                  >
                    ⚡ Entrega rápida
                  </Chip>
                  <p className="text-xl font-bold text-primary">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Controles de Cantidad */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold text-sm">
                      {item.cantidad}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
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
                    onPress={() => removeItem(item.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* DERECHA: Resumen (30%) */}
        <div className="lg:col-span-4">
          <Card className="bg-white shadow-sm border border-gray-100 sticky top-24">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen</h3>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Para envío gratis:</span>
                  <span className="font-semibold text-success">
                    Faltan $
                    {(2000 - subtotal > 0
                      ? 2000 - subtotal
                      : 0
                    ).toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={progressToFreeShipping}
                  color="success"
                  className="h-2"
                />
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Costo de Envío</span>
                  <span className="font-semibold text-success">¡Gratis!</span>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full font-bold shadow-md"
                onPress={handleCheckoutClick}
                isLoading={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Iniciar compra"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
