// src/application/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// 1. Interfaces y Tipos
// ==========================================
export interface Product {
  id: string | number;
  nombre: string;
  precio: number;
  imagen: string;
  marca: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  // Acciones
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  // Getters derivados
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// ==========================================
// 2. Lógica de Negocio y Estado Global
// ==========================================
export const useCartStore = create<CartState>()(
  // 4. Persistencia en LocalStorage
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex >= 0) {
            // Inmutabilidad: Clonamos el array y el item específico
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }

          // Si el producto es nuevo en el carrito
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeFromCart: (productId: string | number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string | number, quantity: number) => {
        // Lógica automática de remoción si la cantidad baja a 0
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // ==========================================
      // 3. Selectores / Getters Derivados
      // ==========================================
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },
    }),
    {
      name: "app-celulares-cart", // Clave del localStorage
    }
  )
);