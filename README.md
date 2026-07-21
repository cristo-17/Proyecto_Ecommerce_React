# AppCelulares - Plataforma E-Commerce (Frontend)

Una plataforma de comercio electrónico moderna, escalable y de alto rendimiento diseñada para la venta y gestión de equipos móviles. Este proyecto implementa un frontend robusto basado en **Clean Architecture** y principios SOLID, operando bajo un modelo de control de acceso basado en roles (RBAC) y preparado estructuralmente para comunicarse con una API RESTful en Java (Spring Boot).

---

## Descripción del Proyecto y Flujo de la Aplicación

AppCelulares no es solo una tienda virtual; es un sistema de gestión integral donde conviven tres tipos de usuarios en un ecosistema seguro:

1. **El Cliente:** Navega por un catálogo dinámico con filtros avanzados (marca, precio), visualiza detalles técnicos, maneja un carrito de compras interactivo y finaliza sus pedidos mediante una integración de pagos segura (PayU). También cuenta con un panel para gestionar sus tarjetas y revisar el estado logístico de sus compras.
2. **El Proveedor:** Cuenta con un entorno privado (Dashboard) donde puede publicar nuevos equipos celulares, actualizar especificaciones y controlar su inventario de forma autónoma.
3. **El Administrador:** Tiene una visión panorámica de toda la plataforma. Supervisa el inventario global, gestiona el alta/baja de las empresas proveedoras, crea cupones de descuento y visualiza métricas de ingresos globales.

El sistema garantiza que los datos sensibles se mantengan seguros mediante autenticación JWT, interceptores HTTP y protección de rutas en el lado del cliente.

---

## Tecnologías Utilizadas

El stack tecnológico fue seleccionado bajo estrictos estándares de ingeniería de software para garantizar tipado seguro, rendimiento y mantenibilidad:

*   **Core:** React 18 + TypeScript + Vite.
*   **Gestión de Estado:** **Zustand** (con persistencia en `localStorage` para el carrito y la sesión de usuario).
*   **Cliente HTTP:** Axios (con interceptores para inyección automática de tokens JWT y manejo de errores 401).
*   **Estilos y UI:** Tailwind CSS v4 + HeroUI.
    *   *Nota Arquitectónica:* Se aplicó una regla inquebrantable de importaciones granulares (ej. `@heroui/button`) para maximizar el *tree-shaking* y optimizar el tamaño del bundle final.
*   **Iconografía Vectorial:** Lucide React (ecosistema de iconos SVG profesionales).
*   **Enrutamiento:** React Router DOM (con protección estricta de rutas por roles).
*   **Formularios y Validación:** React Hook Form + Zod (Type-Safe forms).
*   **Visualización de Datos:** Recharts (para analíticas del Dashboard).

---

## Arquitectura del Proyecto (Clean Architecture)

El proyecto respeta una separación estricta de responsabilidades, aislando la lógica de negocio de la interfaz de usuario. Esto permite que el código sea testeable, escalable y fácil de mantener.

```text
app-celulares/
├── public/                 # Assets estáticos y configuraciones públicas
├── src/
│   ├── application/        # Casos de uso de la app: Hooks personalizados (useCatalogFilters) y Stores de Zustand
│   ├── domain/             # Núcleo del negocio: Modelos, Interfaces TS (appCelulares.model.ts) y Types
│   ├── infrastructure/     # Comunicación externa: Cliente Axios, servicios de API y pasarelas de pago (PayU)
│   └── presentation/       # Interfaz de Usuario (UI) visual
│       ├── components/     # Componentes visuales reutilizables y Guards de seguridad (ProtectedRoute)
│       ├── layouts/        # Estructuras maestras (MainLayout para tienda, DashboardLayout para backoffice)
│       ├── pages/          # Vistas principales (Catalog, Dashboard, ClientProfile)
│       └── router/         # Configuración centralizada de rutas (App.tsx)
├── eslint.config.js        # Configuración estricta de linter para calidad de código
├── tailwind.config.ts      # Configuración base de Tailwind y plugins
└── package.json            # Dependencias modulares
```

Sistema de Enrutamiento y Seguridad (RBAC)
La navegación de la aplicación está rigurosamente protegida por el componente ProtectedRoute, el cual evalúa el estado de autenticación y el rol del usuario almacenado en Zustand.

El archivo App.tsx organiza las rutas en tres zonas principales:

1. Zona de Autenticación
/login: Única puerta de entrada al sistema para acceder a funciones privadas.

2. Zona Pública y Clientes (MainLayout)
Renderiza el encabezado público y el pie de página de la tienda.

Públicas: / (Catálogo general), /producto/:id (Detalles), /cart (Carrito de compras). Accesibles para invitados y usuarios logueados.

Privadas (Solo Cliente/Admin): /checkout (Validación de stock final y pasarela de pago).

Privadas (Solo Cliente): /perfil (Historial de pedidos, rastreo logístico, gestión de métodos de pago y eliminación de cuenta).

3. Zona de Gestión Empresarial (DashboardLayout)
Renderiza la barra lateral (Sidebar) de administración y métricas.

Privadas (Admin y Proveedor):

/dashboard: Analíticas (El Admin ve todo el sistema; el Proveedor solo su empresa).

/dashboard/proveedores: El Admin gestiona empresas (CRUD); el Proveedor edita su propio perfil fiscal.

/dashboard/inventario: El Admin tiene vista de solo lectura; el Proveedor tiene control total de altas, bajas y modificaciones de su stock.

Características Principales (Features)
Motor de Filtros Optimizado: El catálogo cuenta con un buscador con Debounce y filtros dinámicos por marca y precio que construyen consultas complejas optimizando el rendimiento de la red.

Validación de Stock en Tiempo Real: El sistema evita ventas "fantasma" cruzando la información del carrito contra la base de datos milisegundos antes del pago.

Integración PayU Latam: Creación dinámica de firmas criptográficas (MD5) e inyección de formularios ocultos para delegar el cobro a una entidad certificada.

Zona Peligrosa (Derecho al Olvido): Implementación de flujos de eliminación de cuenta de usuario con modales de confirmación crítica.

Simulación de Borrado en Cascada: Módulo administrativo con advertencias críticas sobre la eliminación de un proveedor y la repercusión directa sobre el inventario y las reseñas asociadas.

Instrucciones de Instalación y Uso
Sigue estos pasos para levantar el entorno de desarrollo local y conectar el frontend con el backend.

1. Clonar el repositorio
```Bash
git clone [https://github.com/tu-usuario/app-celulares.git](https://github.com/tu-usuario/app-celulares.git)
cd app-celulares
```
2. Instalar dependencias
Debido a la arquitectura modular de HeroUI y las librerías implementadas, instala las dependencias utilizando NPM.

```Bash
npm install
```
3. Configuración del Servidor de Desarrollo
El proyecto utiliza Vite. Se ha configurado un proxy en vite.config.ts para evitar errores de CORS durante el desarrollo, redirigiendo las peticiones de /api hacia el backend en Spring Boot (http://localhost:8080).

4. Levantar la aplicación
Inicia el entorno de desarrollo con Hot Module Replacement (HMR).

```Bash
npm run dev
```
El proyecto estará disponible localmente en http://localhost:5173/.
