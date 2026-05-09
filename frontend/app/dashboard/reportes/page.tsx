'use client';

import { useEffect, useState } from 'react';
import { reportesService }  from '@/services/reportes.service';
import { empleadosService } from '@/services/empleados.service';

const BADGE: Record<string, string> = {
  PRESENTE:      'bg-green-100 text-green-700',
  TARDANZA:      'bg-yellow-100 text-yellow-700',
  AUSENTE:       'bg-red-100 text-red-700',
  JUSTIFICADO:   'bg-blue-100 text-blue-700',
  DIA_FESTIVO:   'bg-purple-100 text-purple-700',
  FIN_DE_SEMANA: 'bg-gray-100 text-gray-500',
};

export default function ReportesPage() {
  const [empleados,     setEmpleados]     = useState<any[]>([]);
  const [empleadoSelec, setEmpleadoSelec] = useState('');
  const [mes,           setMes]           = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [reporte,   setReporte]   = useState<any>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    empleadosService.getAll().then(setEmpleados).catch(console.error);
  }, []);

  const generarReporte = async () => {
    if (!empleadoSelec) {
      setError('Selecciona un empleado');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setReporte(null);
      const data = await reportesService.getMensual(empleadoSelec, mes);
      setReporte(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al generar el reporte');
    } finally { setLoading(false); }
  };

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'short', day: '2-digit', month: '2-digit',
    });

  const formatHora = (fecha?: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Reportes</h2>
        <p className="text-gray-500 mt-1">Reporte mensual de asistencia por empleado</p>
      </div>

      {/* Panel de búsqueda */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Generar Reporte
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado
            </label>
            <select
              value={empleadoSelec}
              onChange={e => setEmpleadoSelec(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar empleado...</option>
              {empleados.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.apellidos}, {emp.nombres} — {emp.departamento?.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <input
              type="month"
              value={mes}
              onChange={e => setMes(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generarReporte}
            disabled={loading || !empleadoSelec}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold"
          >
            {loading ? 'Generando...' : '📊 Generar Reporte'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Resultado del reporte */}
      {reporte && (
        <div className="space-y-6">

          {/* Info del empleado */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {reporte.empleado.nombreCompleto}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Cédula: {reporte.empleado.cedula}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{reporte.empleado.departamento}</p>
                <p className="mt-1">{reporte.empleado.horario}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {reporte.empleado.horaEntrada} — {reporte.empleado.horaSalida}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Período:{' '}
                <span className="font-medium text-gray-700">
                  {reporte.periodo.inicio} al {reporte.periodo.fin}
                </span>
                {' · '}
                <span className="font-medium text-gray-700">
                  {reporte.periodo.totalRegistros} registros
                </span>
              </p>
            </div>
          </div>

          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Días Presente',
                valor: reporte.resumen.diasPresente,
                color: 'border-green-500',
                text:  'text-green-600',
              },
              {
                label: 'Días con Tardanza',
                valor: reporte.resumen.diasTardanza,
                color: 'border-yellow-500',
                text:  'text-yellow-600',
              },
              {
                label: 'Días Ausente',
                valor: reporte.resumen.diasAusente,
                color: 'border-red-500',
                text:  'text-red-600',
              },
              {
                label: 'Total Horas',
                valor: `${reporte.resumen.totalHorasTrabajadas}h`,
                color: 'border-blue-500',
                text:  'text-blue-600',
              },
            ].map(stat => (
              <div
                key={stat.label}
                className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${stat.color}`}
              >
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.text}`}>
                  {stat.valor}
                </p>
              </div>
            ))}
          </div>

          {/* Stats secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Promedio horas/día',
                valor: `${reporte.resumen.promedioHorasPorDia}h`,
                icon: '⏱',
              },
              {
                label: 'Total minutos de tardanza',
                valor: `${reporte.resumen.totalMinutosTarde} min`,
                icon: '⚠️',
              },
              {
                label: 'Días justificados',
                valor: reporte.resumen.diasJustificado,
                icon: '📝',
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-800">{stat.valor}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detalle día a día */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">
                Detalle por Día
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Fecha', 'Entrada', 'Salida', 'Horas trabajadas', 'Tardanza', 'Estado']
                      .map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reporte.detalle.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        No hay registros en este período.
                      </td>
                    </tr>
                  ) : reporte.detalle.map((dia: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {formatFecha(dia.fecha)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatHora(dia.horaEntrada)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatHora(dia.horaSalida)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dia.horasTrabajadas
                          ? `${Number(dia.horasTrabajadas).toFixed(2)}h`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {dia.minutosTarde > 0 ? (
                          <span className="text-yellow-600 font-medium">
                            {dia.minutosTarde} min
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          BADGE[dia.estado] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {dia.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}