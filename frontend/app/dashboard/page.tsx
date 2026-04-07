'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Usuario } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    // Verificar si hay token guardado
    const token = localStorage.getItem('accessToken');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!token) {
      router.push('/login');
      return;
    }

    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [router]);

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Sistema de Asistencia
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {usuario.email}
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
            {usuario.rol}
          </span>
          <button
            onClick={() => authService.logout()}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Bienvenido, {usuario.email}! 👋
        </h2>

        {/* Tarjetas de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => router.push('/dashboard/departamentos')}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-blue-500"
          >
            <h3 className="font-semibold text-gray-800 text-lg">
              Departamentos
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Gestionar departamentos de la empresa
            </p>
          </div>

          <div
            onClick={() => router.push('/dashboard/empleados')}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-green-500"
          >
            <h3 className="font-semibold text-gray-800 text-lg">
              Empleados
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Gestionar empleados y sus datos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-300 opacity-50">
            <h3 className="font-semibold text-gray-800 text-lg">
              Asistencia
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Próximamente — Sprint 2
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}