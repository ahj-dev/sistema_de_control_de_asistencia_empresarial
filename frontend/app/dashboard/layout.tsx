//Este Layout es el componente que envuelve todas las páginas del dashboard. 
//Tiene el sidebar de navegación y el área de contenido. 
//Lo creamos una vez y todas las páginas lo heredan automáticamente gracias al App Router de Next.js.
//El 'use client' al inicio indica que este componente se renderiza en el cliente,
//lo que nos permite usar hooks como useState y useEffect para manejar la autenticación y la navegación.
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Menú de navegación — cada item tiene ruta e ícono
const menuItems = [
  { label: 'Dashboard',     href: '/dashboard',                 icon: '🏠' },
  { label: 'Departamentos', href: '/dashboard/departamentos',   icon: '🏢' },
  { label: 'Empleados',     href: '/dashboard/empleados',       icon: '👥' },
  { label: 'Horarios',      href: '/dashboard/horarios',        icon: '🕐' },
  { label: 'Asistencia',    href: '/dashboard/asistencia',      icon: '📋' },
  { label: 'Reportes',      href: '/dashboard/reportes',       icon: '📊' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<{ email: string; rol: string } | null>(null);

  useEffect(() => {
    const token    = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('usuario');

    if (!token) {
      router.push('/login');
      return;
    }
    if (userData) setUsuario(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white">
            Control de Asistencia
          </h1>
          <p className="text-xs text-slate-400 mt-1">Sistema Empresarial</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const activo = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activo
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Info del usuario */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="px-4 py-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400">Conectado como</p>
            <p className="text-sm text-white font-medium truncate mt-0.5">
              {usuario.email}
            </p>
            <span className="inline-block mt-1.5 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
              {usuario.rol}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 text-sm text-red-400 hover:text-red-300 text-left px-4"
          >
            Cerrar sesión →
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}