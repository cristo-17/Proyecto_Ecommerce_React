// src/presentation/layouts/DashboardLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { User } from "@heroui/user";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { LayoutDashboard, Users, Package, LogOut } from "lucide-react";

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
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 flex flex-col bg-white border-r border-zinc-200/60 z-10">
        <div className="p-7">
          <Link
            to="/"
            className="text-2xl font-bold text-zinc-900 tracking-tight hover:opacity-70 transition-opacity block"
          >
            AppCelulares
          </Link>
          <p className="text-xs text-zinc-500 font-light mt-1 tracking-wide uppercase">
            Panel de Gestión
          </p>
        </div>

        <Divider className="bg-zinc-100" />

        <ScrollShadow className="flex-1 px-4 py-6">
          <nav className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="p-3 text-sm font-medium text-zinc-500 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex items-center gap-3"
            >
              <LayoutDashboard size={20} strokeWidth={1.5} /> Panel Principal
            </Link>

            {/* Ruta compartida: Admin gestiona a todos, Proveedor edita su perfil */}
            <Link
              to="/dashboard/proveedores"
              className="p-3 text-sm font-medium text-zinc-500 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex items-center gap-3"
            >
              <Users size={20} strokeWidth={1.5} />{" "}
              {userRole === "ADMIN"
                ? "Gestión Proveedores"
                : "Perfil de Empresa"}
            </Link>

            <Link
              to="/dashboard/inventario"
              className="p-3 text-sm font-medium text-zinc-500 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex items-center gap-3"
            >
              <Package size={20} strokeWidth={1.5} /> Inventario
            </Link>
          </nav>
        </ScrollShadow>

        {/* Sección Fija Inferior */}
        <div className="p-6 flex flex-col gap-5 mt-auto border-t border-zinc-100 bg-white">
          <User
            name="Usuario Sistema"
            description={userRole}
            classNames={{
              name: "font-semibold text-zinc-900 tracking-tight",
              description: "text-zinc-500 font-light text-xs tracking-wide",
            }}
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              className: "border border-zinc-200",
            }}
          />
          <Button
            onPress={handleLogout}
            color="default"
            variant="flat"
            className="w-full font-medium bg-zinc-100 text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors shadow-none"
            startContent={<LogOut size={16} strokeWidth={1.5} />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Área Principal (Outlet) */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
};
