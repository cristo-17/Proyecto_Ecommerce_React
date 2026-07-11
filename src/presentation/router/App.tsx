// src/presentation/router/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. Layouts
import { MainLayout } from "../layouts/MainLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

// 2. Componentes de Protección (Guard)
import { ProtectedRoute } from "../components/ProtectedRoute";

// 3. Páginas (Vistas)
import { Login } from "../pages/Login";
import { Catalog } from "../pages/Catalog";
import { ProductDetails } from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { Dashboard } from "../pages/Dashboard";
import { ProveedorForm } from "../pages/ProveedorForm";
import { NotFound } from "../pages/NotFound";

// ------------------------------------------------------------------
// Vistas Simuladas (Placeholders) para flujos pendientes
// ------------------------------------------------------------------
const Inventario = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">
      Gestión de Inventario Físico
    </h1>
    <p className="text-default-500 mt-2">Módulo en construcción...</p>
  </div>
);

// ------------------------------------------------------------------
// Configuración del Enrutador
// ------------------------------------------------------------------
const router = createBrowserRouter([
  // --- ZONA DE AUTENTICACIÓN ---
  {
    path: "/login",
    element: <Login />,
  },

  // --- ZONA 1: PÚBLICA (E-commerce Libre) ---
  {
    path: "/",
    element: <MainLayout />, // Incluye el Navbar dinámico (Badge del Carrito, Logout)
    children: [
      { index: true, element: <Catalog /> }, // Vista principal de la tienda (Grilla de productos)
      { path: "celular/:id", element: <ProductDetails /> }, // Detalle de cada equipo
      { path: "cart", element: <Cart /> }, // Vista del carrito de compras (2 columnas)
    ],
  },

  // --- ZONA 2: PRIVADA CLIENTES (Checkout Segurizado) ---
  {
    path: "/checkout",
    // Protegemos la ruta validando el rol (Solo clientes o admins pueden comprar)
    element: <ProtectedRoute allowedRoles={["CLIENTE", "ADMIN"]} />,
    children: [
      {
        element: <MainLayout />, // Reutilizamos el layout público para no perder el Navbar
        children: [
          { index: true, element: <Checkout /> }, // Formulario final de pago y envío
        ],
      },
    ],
  },

  // --- ZONA 3: PRIVADA ADMINISTRACIÓN Y PROVEEDORES (Panel de Gestión) ---
  {
    path: "/dashboard",
    // Permitimos acceso a los roles empresariales (el Dashboard.tsx filtra el contenido internamente)
    element: <ProtectedRoute allowedRoles={["ADMIN", "PROVEEDOR"]} />,
    children: [
      {
        element: <DashboardLayout />, // Layout con Sidebar lateral y botón de Cerrar Sesión
        children: [
          { index: true, element: <Dashboard /> }, // Vista con métricas, Recharts y Tabla de HeroUI
          { path: "proveedores", element: <ProveedorForm /> }, // Formulario estricto Zod + react-hook-form
          { path: "inventario", element: <Inventario /> }, // Placeholder pendiente
        ],
      },
    ],
  },

  // --- RUTAS NO ENCONTRADAS (Wildcard 404) ---
  {
    path: "*",
    element: <NotFound />, // Página de error atractiva con botón de regreso al inicio
  },
]);

// ------------------------------------------------------------------
// Exportación del Proveedor de Rutas
// ------------------------------------------------------------------
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
