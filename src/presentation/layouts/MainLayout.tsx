// src/presentation/layouts/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { ShoppingCart, Package, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// Importación del nuevo Footer
import { Footer } from "../components/Footer";
import { useCartStore } from "../../application/store/useCartStore";
import { useAuthStore } from "../../application/store/useAuthStore";

export const MainLayout = () => {
  const navigate = useNavigate();

  // 1. Consumo del Store de Autenticación
  const { isAuthenticated, user, logout } = useAuthStore();

  // Extrae los items y calcula el total de unidades dinámicamente
  const { items } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // --- Consumo de next-themes para Modo Oscuro/Claro ---
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevenir errores de hidratación asegurando que el componente se montó en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // 3. Ejecutar función logout de Zustand y redirigir
    logout();
    navigate("/login");
  };

  const renderNavActions = () => {
    // 2. Renderizado Condicional basado en isAuthenticated
    if (!isAuthenticated) {
      return (
        <div className="flex items-center gap-2">
          <NavbarItem>
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="light"
              className="font-medium text-default-500 hover:text-foreground"
            >
              Iniciar Sesión
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="default"
              variant="solid"
              className="font-medium bg-foreground text-background"
            >
              Regístrate
            </Button>
          </NavbarItem>
        </div>
      );
    }

    // Si el usuario está autenticado, mostramos las acciones según su rol
    const userName = user?.nombre || "Usuario";

    switch (user?.rol) {
      case "CLIENTE":
        return (
          <div className="flex items-center gap-4">
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm font-medium text-default-500">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/perfil"
                color="default"
                variant="light"
                className="font-medium text-default-500 hover:text-foreground"
              >
                Mi Perfil
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Badge
                content={totalItems}
                color="danger"
                shape="circle"
                isInvisible={totalItems === 0}
              >
                <Button
                  as={Link}
                  to="/carrito"
                  color="default"
                  variant="bordered"
                  className="font-medium border-divider text-foreground hover:bg-default-100"
                  startContent={<ShoppingCart size={18} strokeWidth={1.5} />}
                >
                  Carrito
                </Button>
              </Badge>
            </NavbarItem>
            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="font-medium text-default-500 hover:text-danger"
              >
                Cerrar Sesión
              </Button>
            </NavbarItem>
          </div>
        );

      case "PROVEEDOR":
        return (
          <div className="flex items-center gap-4">
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm font-medium text-default-500">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/dashboard"
                color="default"
                variant="bordered"
                className="font-medium border-divider text-foreground hover:bg-default-100"
                startContent={<Package size={18} strokeWidth={1.5} />}
              >
                Mi Inventario
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="font-medium text-default-500 hover:text-danger"
              >
                Cerrar Sesión
              </Button>
            </NavbarItem>
          </div>
        );

      case "ADMIN":
        return (
          <div className="flex items-center gap-4">
            <NavbarItem>
              <Button
                as={Link}
                to="/dashboard"
                color="default"
                variant="solid"
                className="font-medium transition-colors bg-foreground text-background"
                startContent={<Settings size={18} strokeWidth={1.5} />}
              >
                Panel Admin
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="font-medium text-default-500 hover:text-danger"
              >
                Cerrar Sesión
              </Button>
            </NavbarItem>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    // 1. Corrección del Contenedor Raíz (Modo Oscuro)
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      <Navbar
        maxWidth="xl"
        className="py-2 border-b border-divider bg-background/80 backdrop-blur-md"
      >
        <NavbarBrand>
          <Link
            to="/"
            className="font-bold text-inherit text-xl text-foreground tracking-tight hover:opacity-70 transition-opacity"
          >
            AppCelulares
          </Link>
        </NavbarBrand>

        {/* 2. Limpieza de Interfaz (Buscador removido) */}

        <NavbarContent justify="end">
          {renderNavActions()}

          {/* Botón Theme Switcher inyectado armoniosamente al final */}
          <NavbarItem className="ml-2">
            {!mounted ? (
              <div className="w-10 h-10" /> // Espaciador para evitar saltos de layout (CLS)
            ) : (
              <Button
                isIconOnly
                variant="light"
                aria-label="Alternar tema"
                className="text-default-500 hover:text-foreground transition-colors"
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun size={20} strokeWidth={1.5} />
                ) : (
                  <Moon size={20} strokeWidth={1.5} />
                )}
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 flex-grow py-12">
        <Outlet />
      </main>

      {/* Renderización del Footer Profesional */}
      <Footer />
    </div>
  );
};
