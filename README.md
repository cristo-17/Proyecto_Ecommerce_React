# AppCelulares - Plataforma E-Commerce (Frontend)

Una plataforma de comercio electrónico moderna, escalable y de alto rendimiento diseñada para la venta y gestión de equipos móviles. Este proyecto implementa un frontend robusto basado en **Clean Architecture** y principios SOLID, preparado estructuralmente para integrarse de forma nativa con una futura API RESTful en Java (Spring Boot).

---

## Tecnologías Utilizadas

El stack tecnológico fue seleccionado bajo estrictos estándares de ingeniería de software para garantizar tipado seguro, rendimiento y mantenibilidad:

*   **Core:** React 18 + TypeScript + Vite.
*   **Estilos y UI:** Tailwind CSS v4 + HeroUI v3.
    *   *Nota Arquitectónica:* Se ha aplicado una **regla inquebrantable de importaciones granulares** (ej. `@heroui/button`, `@heroui/card`) para maximizar el *tree-shaking* y optimizar el tamaño del bundle final.
*   **Iconografía Vectorial:** **Lucide React**. Se sustituyó la iconografía estándar (emojis) por un ecosistema de iconos SVG profesionales y uniformes.
*   **Enrutamiento:** React Router DOM v6/v7 (con protección de rutas por roles).
*   **Formularios y Validación:** React Hook Form + Zod (Type-Safe forms).
*   **Visualización de Datos:** Recharts (para analíticas del Dashboard).

---

## Características Principales (Features)

*   **Sistema Multi-Rol Seguro (RBAC):** Control de acceso estricto mediante *Guards* para CLIENTE, PROVEEDOR y ADMIN. La interfaz transmuta dinámicamente según el rol autorizado.
*   **Gestión Dinámica de Perfiles (Cliente):** 
    *   Panel de gestión segura de formas de pago (tarjetas censuradas).
    *   **Zona Peligrosa:** Implementación de flujos de eliminación de cuenta ("Derecho al Olvido") con modales de confirmación crítica.
*   **Gestión Avanzada de Proveedores (Admin):** 
    *   Módulo administrativo para el control de empresas registradas.
    *   Soporte para cambios de estado (Activo/Inactivo).
    *   Simulación de **borrado en cascada** (advertencias críticas sobre la eliminación del inventario asociado).
*   **Dashboard Analítico Inteligente:** 
    *   **Admin:** Vista panorámica global y gráficos interactivos de rendimiento de ventas de todo el sistema.
    *   **Proveedor:** Entorno aislado con métricas propias y control exclusivo sobre su stock registrado.
*   **Catálogo y Detalles Técnicos:** Grilla de productos responsiva y vista de producto enfocada en la conversión, con renderizado condicional del "Call to Action" y módulo de reseñas.
*   **Checkout Optimizado:** Flujo de pago con carrito interactivo y cálculos dinámicos.

---

## Estructura del Proyecto (Clean Architecture)

El proyecto respeta una separación estricta de responsabilidades, aislando la lógica de negocio de la interfaz de usuario:

```text
app-celulares/
├── public/                 # Assets estáticos
├── src/
│   ├── application/        # Lógica de aplicación, Hooks personalizados y Context/Zustand
│   ├── domain/             # Modelos (Interfaces TS, ej: appCelulares.model.ts) y reglas puras
│   ├── infrastructure/     # Capa de red, configuración de Axios y servicios de API
│   └── presentation/       # Interfaz de Usuario (UI)
│       ├── components/     # Componentes visuales reutilizables y Guards (ProtectedRoute)
│       ├── layouts/        # Estructuras maestras (MainLayout, DashboardLayout)
│       ├── pages/          # Vistas principales (Catalog, Dashboard, ClientProfile)
│       └── router/         # Configuración centralizada de rutas (App.tsx)
├── eslint.config.js        # Configuración estricta de linter
├── tailwind.config.js      # Configuración base de Tailwind v4 y plugins
└── package.json            # Dependencias modulares y granulares

Instrucciones de Instalación y Uso
Sigue estos pasos para levantar el entorno de desarrollo local.

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/app-celulares.git
cd app-celulares

2. Instalar dependencias
Debido a la arquitectura modular de HeroUI, todas las dependencias están separadas por paquetes individuales para mantener el entorno ligero.
Bash```
npm install

3. Levantar el servidor de desarrollo
Inicia Vite con Hot Module Replacement (HMR).
Bash```
npm run dev


El proyecto estará disponible localmente en http://localhost:5173/.

---

### 2. Enrutador Principal Final (`src/presentation/router/App.tsx`)

Este archivo consolida todas las rutas, anidamientos de Layouts y la protección de accesos basados en roles.

```tsx
// src/presentation/router/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// 2. Guards
import { ProtectedRoute } from '../components/ProtectedRoute';

// 3. Pages
import { Login } from '../pages/Login';
import { Catalog } from '../pages/Catalog';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { ClientProfile } from '../pages/ClientProfile';
import { Dashboard } from '../pages/Dashboard';
import { ProveedorForm } from '../pages/ProveedorForm';
import { ProviderDashboard } from '../pages/ProviderDashboard';
import { NotFound } from '../pages/NotFound';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ==========================================
            ZONA DE AUTENTICACIÓN
            ========================================== */}
        <Route path="/login" element={<Login />} />


        {/* ==========================================
            ZONA PÚBLICA Y CLIENTES (MainLayout)
            ========================================== */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Rutas 100% Públicas */}
          <Route index element={<Catalog />} />
          <Route path="producto/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />

          {/* Rutas Protegidas - Checkout Compartido */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENTE', 'ADMIN']} />}>
            <Route path="checkout" element={<Checkout />} />
          </Route>

          {/* Rutas Protegidas - Módulo de Cliente */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENTE']} />}>
            <Route path="perfil" element={<ClientProfile />} />
          </Route>

        </Route>


        {/* ==========================================
            ZONA DE GESTIÓN EMPRESARIAL (DashboardLayout)
            ========================================== */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'PROVEEDOR']} />}>
          
          <Route element={<DashboardLayout />}>
            
            {/* Analíticas y Panel Principal */}
            <Route index element={<Dashboard />} />
            
            {/* Gestión de Perfil de Empresa / Control Global */}
            <Route path="proveedores" element={<ProveedorForm />} />
            
            {/* Gestión de Inventario */}
            <Route path="inventario" element={<ProviderDashboard />} />
            
          </Route>

        </Route>


        {/* ==========================================
            MANEJO DE ERRORES (Wildcard 404)
            ========================================== */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
};
