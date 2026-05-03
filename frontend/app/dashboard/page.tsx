//DashboardPage es la página principal del dashboard. 
//Muestra un resumen con estadísticas clave como el número de empleados activos y departamentos,
//y tiene tarjetas que enlazan a las secciones de gestión de empleados, departamentos, asistencia y horarios.
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { departamentosService } from '@/services/departamentos.service';
import { empleadosService } from '@/services/empleados.service';


export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    empleados:    0,
    departamentos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [empleados, departamentos] = await Promise.all([
          empleadosService.getAll(),
          departamentosService.getAll(),
        ]);
        setStats({
          empleados:     empleados.length,
          departamentos: departamentos.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, []);

  const tarjetas = [
    {
      label:  'Departamentos',
      valor:  stats.departamentos,
      icon:   '🏢',
      color:  'border-blue-500',
      href:   '/dashboard/departamentos',
    },
    {
      label:  'Empleados Activos',
      valor:  stats.empleados,
      icon:   '👥',
      color:  'border-green-500',
      href:   '/dashboard/empleados',
    },
    {
      label:  'Registrar Asistencia',
      valor:  '→',
      icon:   '📋',
      color:  'border-purple-500',
      href:   '/dashboard/asistencia',
    },
    {
      label:  'Horarios',
      valor:  '→',
      icon:   '🕐',
      color:  'border-amber-500',
      href:   '/dashboard/horarios',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Panel de Control
        </h2>
        <p className="text-gray-500 mt-1">
          Resumen general del sistema de asistencia
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tarjetas.map((t) => (
            <div
              key={t.href}
              onClick={() => router.push(t.href)}
              className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${t.color}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {t.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {t.valor}
                  </p>
                </div>
                <span className="text-3xl">{t.icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}