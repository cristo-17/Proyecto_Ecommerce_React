// src/presentation/layouts/DashboardLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { User } from "@heroui/user";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";

// Simulación de rol inyectado (En producción vendría de Zustand/Context)
const CURRENT_USER_ROLE = "ADMIN";

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-default-50 overflow-hidden">
      {/* Sidebar Lateral */}
      <aside className="w-64 flex flex-col bg-background border-r border-default-200">
        <div className="p-6">
          {/* Logo clickeable hacia la tienda pública */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity block"
          >
            AppCelulares
          </Link>
          <p className="text-xs text-default-500 mt-1">Panel de Gestión</p>
        </div>

        <Divider />

        <ScrollShadow className="flex-1 p-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors"
            >
              📊 Panel Principal
            </Link>
            {CURRENT_USER_ROLE === "ADMIN" && (
              <Link
                to="/dashboard/proveedores"
                className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors"
              >
                🏢 Gestión Proveedores
              </Link>
            )}
            <Link
              to="/dashboard/inventario"
              className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors"
            >
              📱 Inventario
            </Link>
          </nav>
        </ScrollShadow>

        <Divider />

        {/* Sección del Perfil y Logout */}
        <div className="p-4 flex flex-col gap-4">
          <User
            name="Usuario Sistema"
            description={CURRENT_USER_ROLE}
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
          <Button
            onPress={handleLogout}
            color="danger"
            variant="flat"
            className="w-full font-semibold"
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
