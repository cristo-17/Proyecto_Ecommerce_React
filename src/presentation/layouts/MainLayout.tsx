// src/presentation/layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Badge } from "@heroui/badge";

export const MainLayout = () => {
  const navigate = useNavigate();

  // Estado global simulado (Preparando el terreno para Redux/Zustand)
  const cartCount: number = 3;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar maxWidth="xl" isBordered>
        {/* Izquierda: Logo */}
        <NavbarBrand>
          <Link
            to="/"
            className="font-bold text-inherit text-xl text-primary hover:opacity-80 transition-opacity"
          >
            AppCelulares
          </Link>
        </NavbarBrand>

        {/* Centro: Búsqueda */}
        <NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
          <NavbarItem className="w-full max-w-lg">
            <Input
              classNames={{
                base: "w-full",
                input: "text-small",
                inputWrapper: "font-normal text-default-500 bg-default-400/20",
              }}
              placeholder="Buscar marcas, modelos, accesorios..."
              size="sm"
              startContent={<span>🔍</span>}
              type="search"
            />
          </NavbarItem>
        </NavbarContent>

        {/* Derecha: Acciones */}
        <NavbarContent justify="end">
          <NavbarItem>
            {/* Implementación del Badge simulando notificaciones del carrito */}
            <Badge
              content={cartCount}
              color="danger"
              shape="circle"
              isInvisible={cartCount === 0}
            >
              <Button
                onPress={() => navigate("/cart")}
                color="primary"
                variant="flat"
              >
                🛒 Carrito
              </Button>
            </Badge>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={handleLogout} color="danger" variant="light">
              Cerrar Sesión
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Contenido Dinámico */}
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
