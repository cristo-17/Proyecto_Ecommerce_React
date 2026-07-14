// src/presentation/layouts/MainLayout.tsx
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { ShoppingCart, Package, Settings, Search } from "lucide-react";

// Importación del nuevo Footer
import { Footer } from "../components/Footer";

export const MainLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Lectura del rol y datos simulados de sesión
  const userRole = localStorage.getItem("user_role") || "INVITADO";
  const userName = "Usuario";
  let cartCount = 3;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  // Manejador del buscador funcional
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
                color="default"
                variant="light"
                className="font-medium text-zinc-600 hover:text-zinc-900"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="default"
                variant="solid"
                className="font-medium bg-zinc-900 text-white"
              >
                Regístrate
              </Button>
            </NavbarItem>
          </div>
        );

      case "CLIENTE":
        return (
          <div className="flex items-center gap-4">
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm font-medium text-zinc-500">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/perfil"
                color="default"
                variant="light"
                className="font-medium text-zinc-600 hover:text-zinc-900"
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
                  color="default"
                  variant="bordered"
                  className="font-medium border-zinc-200/60 text-zinc-900 hover:bg-zinc-50"
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
                className="font-medium text-zinc-500 hover:text-danger"
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
              <span className="text-sm font-medium text-zinc-500">
                Hola, {userName}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/dashboard"
                color="default"
                variant="bordered"
                className="font-medium border-zinc-200/60 text-zinc-900 hover:bg-zinc-50"
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
                className="font-medium text-zinc-500 hover:text-danger"
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
                className="bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
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
                className="font-medium text-zinc-500 hover:text-danger"
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar
        maxWidth="xl"
        className="py-2 border-b border-zinc-100 bg-white/80 backdrop-blur-md"
      >
        <NavbarBrand>
          <Link
            to="/"
            className="font-bold text-inherit text-xl text-zinc-900 tracking-tight hover:opacity-70 transition-opacity"
          >
            AppCelulares
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex gap-4 w-full" justify="center">
          <NavbarItem className="w-full max-w-lg">
            <Input
              variant="underlined"
              classNames={{
                base: "w-full",
                input: "text-sm text-zinc-900 placeholder:text-zinc-400",
                inputWrapper:
                  "font-normal shadow-none border-zinc-200 hover:border-zinc-300 focus-within:border-zinc-900",
              }}
              placeholder="Buscar marcas, modelos... (Presiona Enter)"
              size="sm"
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={handleSearch}
              startContent={
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="text-zinc-400 pointer-events-none flex-shrink-0 mb-1"
                />
              }
              type="search"
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">{renderNavActions()}</NavbarContent>
      </Navbar>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 flex-grow py-12">
        <Outlet />
      </main>

      {/* Renderización del Footer Profesional */}
      <Footer />
    </div>
  );
};
