// src/presentation/layouts/DashboardLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { User } from "@heroui/user";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { LayoutDashboard, Users, Package } from "lucide-react";

export const DashboardLayout = () => {
  const navigate = useNavigate();

  // Lectura del rol actual para inyectarlo en la UI
  const userRole = localStorage.getItem("user_role") || "INVITADO";

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-default-50 overflow-hidden">
      {/* Sidebar Lateral */}
      <aside className="w-64 flex flex-col bg-background border-r border-default-200">
        <div className="p-6">
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
            {/* BUG CORREGIDO: Rutas limpias sin prefijos equivocados */}
            <Link
              to="/dashboard"
              className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard size={18} /> Panel Principal
            </Link>

            {/* Ruta compartida: Admin gestiona a todos, Proveedor edita su perfil */}
            <Link
              to="/dashboard/proveedores"
              className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors flex items-center gap-2"
            >
              <Users size={18} />{" "}
              {userRole === "ADMIN"
                ? "Gestión Proveedores"
                : "Perfil de Empresa"}
            </Link>

            <Link
              to="/dashboard/inventario"
              className="p-3 text-sm font-medium rounded-lg hover:bg-default-100 transition-colors flex items-center gap-2"
            >
              <Package size={18} /> Inventario
            </Link>
          </nav>
        </ScrollShadow>

        <Divider />

        {/* Sección Fija Inferior */}
        <div className="p-4 flex flex-col gap-4 mt-auto">
          <User
            name="Usuario Sistema"
            // BUG 3 CORREGIDO: Reemplazo del texto estático "ADMIN" por la variable
            description={userRole}
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
