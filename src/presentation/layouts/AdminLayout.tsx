// src/presentation/layouts/AdminLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../application/store/useAuthStore";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-content1 border-r border-divider text-foreground flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-divider">
          AppCelulares
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="block p-2 rounded hover:bg-default-100 hover:text-foreground transition"
          >
            Dashboard
          </Link>
          <Link
            to="/celulares"
            className="block p-2 rounded hover:bg-default-100 hover:text-foreground transition"
          >
            Celulares
          </Link>
          <Link
            to="/proveedores"
            className="block p-2 rounded hover:bg-default-100 hover:text-foreground transition"
          >
            Proveedores
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-danger text-danger-foreground hover:bg-danger/90 rounded font-medium"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-content1 border-b border-divider shadow flex items-center px-6 justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Panel de Administración
          </h2>
          <div className="text-sm font-medium text-default-500">
            Bienvenido, Admin
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Aquí se renderizan las sub-rutas */}
        </div>
      </main>
    </div>
  );
};
