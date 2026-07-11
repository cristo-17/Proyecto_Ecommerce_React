// src/presentation/layouts/AdminLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-slate-700">
          AppCelulares
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="block p-2 rounded hover:bg-slate-800 transition">Dashboard</Link>
          <Link to="/celulares" className="block p-2 rounded hover:bg-slate-800 transition">Celulares</Link>
          <Link to="/proveedores" className="block p-2 rounded hover:bg-slate-800 transition">Proveedores</Link>
        </nav>
        <button onClick={handleLogout} className="m-4 p-2 bg-red-600 rounded hover:bg-red-700 font-medium">
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
          <div className="text-sm font-medium text-gray-500">Bienvenido, Admin</div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Aquí se renderizan las sub-rutas */}
        </div>
      </main>
    </div>
  );
};