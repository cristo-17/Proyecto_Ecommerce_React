// src/presentation/layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { ShoppingCart, Package, Settings, Search } from "lucide-react";

export const MainLayout = () => {
  const navigate = useNavigate();

  // Lectura del rol y datos simulados de sesión
  const userRole = localStorage.getItem("user_role") || "INVITADO";
  const userName = "Usuario";
  let cartCount = 3;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const renderNavActions = () => {
    switch (userRole) {
      case "INVITADO":
        return (
          <div className="flex items-center gap-2">
            <NavbarItem>
              <Button
                as={Link}
                to="/login"
                color="primary"
                variant="flat"
                className="font-medium"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button color="primary" variant="solid" className="font-medium">
                Regístrate
              </Button>
            </NavbarItem>
          </div>
        );

      case "CLIENTE":
        return (
          <div className="flex items-center gap-4">
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm font-medium text-gray-700">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              {/* BUG 2 CORREGIDO: Botón convertido en Link hacia /perfil */}
              <Button
                as={Link}
                to="/perfil"
                variant="light"
                className="font-medium"
              >
                Mi Perfil
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Badge
                content={cartCount}
                color="danger"
                shape="circle"
                isInvisible={cartCount === 0}
              >
                <Button
                  as={Link}
                  to="/cart"
                  color="primary"
                  variant="flat"
                  className="font-medium"
                  startContent={<ShoppingCart size={18} />}
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
                className="font-medium"
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
              <span className="text-sm font-medium text-gray-700">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/dashboard"
                color="secondary"
                variant="flat"
                className="font-medium"
                startContent={<Package size={18} />}
              >
                Mi Inventario
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="font-medium"
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
                className="bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                startContent={<Settings size={18} />}
              >
                Panel Admin
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="font-medium"
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar maxWidth="xl" isBordered>
        <NavbarBrand>
          <Link
            to="/"
            className="font-bold text-inherit text-xl text-primary hover:opacity-80 transition-opacity"
          >
            AppCelulares
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex gap-4 w-full" justify="center">
          <NavbarItem className="w-full max-w-lg">
            <Input
              classNames={{
                base: "w-full",
                input: "text-small",
                inputWrapper: "font-normal text-default-500 bg-default-400/20",
              }}
              placeholder="Buscar marcas, modelos..."
              size="sm"
              startContent={
                <Search
                  size={18}
                  className="text-default-400 pointer-events-none flex-shrink-0"
                />
              }
              type="search"
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">{renderNavActions()}</NavbarContent>
      </Navbar>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 flex-grow py-8">
        <Outlet />
      </main>

      <footer className="w-full bg-default-100 py-6 text-center text-default-500 text-sm mt-auto">
        © {new Date().getFullYear()} AppCelulares. Todos los derechos
        reservados.
      </footer>
    </div>
  );
};
