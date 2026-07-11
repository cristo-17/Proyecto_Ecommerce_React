AppCelulares - Plataforma E-Commerce (Frontend)
Una plataforma de comercio electrónico moderna, escalable y de alto rendimiento diseñada para la venta y gestión de equipos móviles. Este proyecto implementa un frontend robusto basado en Clean Architecture y principios SOLID, preparado estructuralmente para integrarse de forma nativa con una futura API RESTful desarrollada en Java con Spring Boot.

Tecnologías Utilizadas
El stack tecnológico fue seleccionado bajo estrictos estándares de ingeniería de software para garantizar tipado seguro, rendimiento y mantenibilidad:

Core: React 18 + TypeScript + Vite.

Estilos y UI: Tailwind CSS v4 + HeroUI v3.

Nota Arquitectónica: Se ha aplicado una regla inquebrantable de importaciones granulares (ej. @heroui/button, @heroui/card) para maximizar el tree-shaking y optimizar el tamaño del bundle final.

Enrutamiento: React Router DOM v6/v7 (con protección de rutas por roles).

Formularios y Validación: React Hook Form + Zod (Type-Safe forms).

Visualización de Datos: Recharts (para analíticas del Dashboard).

Características Principales (Features)
Sistema Multi-Rol Seguro: Control de acceso y renderizado condicional mediante Guards para clientes, vendedores, administradores globales y proveedores.

Dashboard Analítico Dinámico:

Admin Global: Vista panorámica de ingresos, gráficos interactivos de rendimiento de ventas (Recharts) y control de inventario de todos los proveedores.

Proveedor: Entorno aislado con métricas propias y control exclusivo sobre su stock registrado.

Catálogo Responsivo: Grilla de productos moderna y optimizada con carga diferida de imágenes (Lazy Loading) y tarjetas interactivas.

Especificaciones Técnicas Detalladas: Vista de producto con galería interactiva, chips de estado y tablas de especificaciones limpias inspiradas en diseños clásicos pero construidas con la utilidad de Tailwind.

Carrito de Compras Inteligente: Panel interactivo de dos columnas, cálculos automáticos de envío gratis y un Badge de notificaciones global en el Navbar sincronizado con el estado.

Checkout Optimizado: Flujo de pago de dos columnas con selección de método de entrega (Tabs), métodos de pago (RadioGroups) y resumen de pedido flotante (Sticky).

Estructura del Proyecto (Clean Architecture)
El proyecto respeta una separación estricta de responsabilidades, aislando la lógica de dominio de la interfaz de usuario:

app-celulares/
├── public/ # Assets estáticos
├── src/
│ ├── application/ # Lógica de aplicación, Hooks personalizados y Context/Zustand
│ ├── domain/ # Modelos (Interfaces TS), Tipos y reglas de negocio puras
│ ├── infrastructure/ # Capa de red, configuración de Axios y servicios de API
│ └── presentation/ # Interfaz de Usuario (UI)
│ ├── components/ # Componentes visuales reutilizables y Guards (ProtectedRoute)
│ ├── layouts/ # Estructuras maestras (MainLayout, DashboardLayout)
│ ├── pages/ # Vistas principales (Catalog, Dashboard, Checkout, Login)
│ └── router/ # Configuración centralizada de rutas (App.tsx, main.tsx)
├── eslint.config.js # Configuración estricta de linter y React Compiler
├── tailwind.config.js # Configuración base de Tailwind v4 y plugins
└── package.json # Dependencias modulares y granulares

Instrucciones de Instalación y Uso
Sigue estos pasos para levantar el entorno de desarrollo local.

1. Clonar el repositorio
   git clone https://github.com/cristo-17/Proyecto_Ecommerce_React.git
   cd app-celulares

2. Instalar dependencias
   Debido a la arquitectura modular de HeroUI, todas las dependencias están separadas por paquetes individuales para mantener el entorno ligero.

npm install

3. Levantar el servidor de desarrollo
   Inicia Vite con Hot Module Replacement (HMR).

npm run dev
