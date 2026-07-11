// src/presentation/components/ShoppingCart.tsx
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

// 1. Tipos Locales (Basados en tu Dominio)
interface CartItem {
  id: string;
  modelo: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

// 2. Mock Data: Items en el carrito
const MOCK_CART: CartItem[] = [
  { id: 'cel-1', modelo: 'iPhone 15 Pro', precio: 1200, cantidad: 1 },
  { id: 'cel-2', modelo: 'Samsung Galaxy S24 Ultra - BMW M Edition', precio: 1450, cantidad: 1 },
];

export const ShoppingCart = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const subtotal = MOCK_CART.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="flat">
        🛒 Ver Carrito ({MOCK_CART.length})
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="md"
        placement="center" // o "right" si tu versión/tema de HeroUI soporta drawers nativos
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Tu Carrito de Compras
              </ModalHeader>
              <ModalBody>
                {MOCK_CART.length === 0 ? (
                  <p className="text-default-500 text-center py-10">Tu carrito está vacío.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {MOCK_CART.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{item.modelo}</span>
                          <span className="text-default-400 text-xs">Cant: {item.cantidad}</span>
                        </div>
                        <span className="font-bold text-primary">
                          ${(item.precio * item.cantidad).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ModalBody>
              <Divider />
              <ModalFooter className="flex flex-col gap-3">
                <div className="flex justify-between w-full font-bold text-lg">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button color="danger" variant="light" onPress={onClose} className="flex-1">
                    Seguir Comprando
                  </Button>
                  <Button color="primary" onPress={onClose} className="flex-1">
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