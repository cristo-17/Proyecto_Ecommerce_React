// src/presentation/components/ShoppingCart.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../application/store/useCartStore";
import { productService } from "../../infrastructure/services/productService";

export const ShoppingCart = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [stockError, setStockError] = useState<string | null>(null);
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  const handleCheckout = async () => {
    setStockError(null);
    setIsCheckingStock(true);

    try {
      // Verificar stock de cada producto contra el backend
      for (const item of items) {
        const product = await productService.getById(String(item.id));
        if (product.stock < item.quantity) {
          setStockError(
            `"${product.modelo}" solo tiene ${product.stock} unidades. Ajusta la cantidad.`,
          );
          setIsCheckingStock(false);
          return;
        }
      }

      // Todo bien, navegar al checkout
      onOpenChange(false);
      navigate("/checkout");
    } catch (error: any) {
      setStockError(
        error.response?.data?.message || "Error al verificar stock.",
      );
      setIsCheckingStock(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        variant="flat"
        className="font-medium"
      >
        🛒 Ver Carrito ({totalItems})
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Tu Carrito de Compras
              </ModalHeader>
              <ModalBody>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-4">
                    <ShoppingBag
                      size={48}
                      strokeWidth={1}
                      className="text-default-400"
                    />
                    <p className="text-default-500 text-center">
                      Tu carrito está vacío.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {item.nombre}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded bg-default-100 text-default-500 hover:bg-default-200"
                            >
                              -
                            </button>
                            <span className="text-default-400 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded bg-default-100 text-default-500 hover:bg-default-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">
                            ${(item.precio * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => removeFromCart(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                    {stockError && (
                      <p className="text-danger text-sm mt-2">{stockError}</p>
                    )}
                  </div>
                )}
              </ModalBody>
              <Divider />
              <ModalFooter className="flex flex-col gap-3">
                <div className="flex justify-between w-full font-bold text-lg">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="flex-1"
                  >
                    Seguir Comprando
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleCheckout}
                    isLoading={isCheckingStock}
                    isDisabled={items.length === 0}
                    className="flex-1"
                  >
                    Ir a Pagar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
