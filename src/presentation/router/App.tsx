// src/presentation/router/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import { Factura } from "../pages/Factura";
import { ClientProfile } from "../pages/ClientProfile";
import { Dashboard } from "../pages/Dashboard";
import { ProveedorForm } from "../pages/ProveedorForm";
import { ProviderDashboard } from "../pages/ProviderDashboard";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { TermsOfService } from "../pages/TermsOfService";
import { NotFound } from "../pages/NotFound";

export const AppRouter = () => {
  return (
    /* 
      1. Contenedor Raíz (Wrapper) 
      Se añaden las clases semánticas de HeroUI para que el ThemeSwitcher 
      pueda aplicar el Modo Oscuro/Claro a todo el lienzo de la aplicación.
    */
    <div className="min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          {/* ==========================================
              ZONA 1: AUTENTICACIÓN
              ========================================== */}
          <Route path="/login" element={<Login />} />

          {/* ==========================================
              ZONA 2: TIENDA PÚBLICA Y CLIENTES
              ========================================== */}
          <Route path="/" element={<MainLayout />}>
            {/* Rutas 100% Públicas (Acceso para INVITADO y logueados) */}
            <Route index element={<Catalog />} />
            <Route path="producto/:id" element={<ProductDetails />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="privacidad" element={<PrivacyPolicy />} />
            <Route path="terminos" element={<TermsOfService />} />

            {/* Rutas Protegidas de Compra y Post-Compra (Solo CLIENTE y ADMIN) */}
            <Route
              element={<ProtectedRoute allowedRoles={["CLIENTE", "ADMIN"]} />}
            >
              <Route path="checkout" element={<Checkout />} />
              <Route path="factura/:id" element={<Factura />} />
            </Route>

            {/* Ruta Protegida Exclusiva del Cliente (Gestión de Tarjetas y Cuenta) */}
            <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
              <Route path="perfil" element={<ClientProfile />} />
            </Route>
          </Route>

          {/* ==========================================
              ZONA 3: PANEL DE GESTIÓN EMPRESARIAL (RBAC)
              ========================================== */}
          {/* Acceso exclusivo para administración y proveedores */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute allowedRoles={["ADMIN", "PROVEEDOR"]} />}
          >
            {/* Envolvemos en el layout del Sidebar */}
            <Route element={<DashboardLayout />}>
              {/* Resumen de métricas (Filtra internamente ADMIN vs PROVEEDOR) */}
              <Route index element={<Dashboard />} />

              {/* Gestión de Empresas (ADMIN ve todos, PROVEEDOR ve su perfil) */}
              <Route path="proveedores" element={<ProveedorForm />} />

              {/* Gestión de Inventario (ADMIN ve todo en lectura, PROVEEDOR hace CRUD) */}
              <Route path="inventario" element={<ProviderDashboard />} />
            </Route>
          </Route>

          {/* ==========================================
              ZONA 4: MANEJO DE ERRORES
              ========================================== */}
          {/* Captura cualquier URL no definida */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
