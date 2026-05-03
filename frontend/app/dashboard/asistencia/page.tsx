// Página principal de asistencia
// Permite a los empleados registrar su entrada y salida, y a los administradores ver un resumen mensual de asistencia con estados como presente, tarde, ausente, etc.
'use client';

import { useEffect, useState } from 'react';
import { asistenciaService } from '@/services/asistencia.service';
import { empleadosService }   from '@/services/empleados.service';

const BADGE: Record<string, string> = {
  PRESENTE:    'bg-green-100 text-green-700',
  TARDANZA:    'bg-yellow-100 text-yellow-700',
  AUSENTE:     'bg-red-100 text-red-700',
  JUSTIFICADO: 'bg-blue-100 text-blue-700',
  DIA_FESTIVO: 'bg-purple-100 text-purple-700',
  FIN_DE_SEMANA: 'bg-gray-100 text-gray-500',
};

export default function AsistenciaPage() {
  const [empleados,       setEmpleados]       = useState<any[]>([]);
  const [registros,       setRegistros]       = useState<any[]>([]);
  const [empleadoSelec,   setEmpleadoSelec]   = useState('');
  const [loadingFichaje,  setLoadingFichaje]  = useState(false);
  const [loadingRegistros,setLoadingRegistros]= useState(false);
  const [mensaje,         setMensaje]         = useState<{texto: string; tipo: 'ok'|'error'} | null>(null);
  const [filtroMes,       setFiltroMes]       = useState(
    new Date().toISOString().slice(0, 7) // "2026-04"
  );

  useEffect(() => {
    empleadosService.getAll().then(setEmpleados).catch(console.error);
  }, []);

  useEffect(() => {
    cargarRegistros();
  }, [filtroMes]);

  const cargarRegistros = async () => {
    try {
      setLoadingRegistros(true);
      const data = await asistenciaService.getAll({ mes: filtroMes });
      setRegistros(data);
    } catch { console.error('Error al cargar registros'); }
    finally  { setLoadingRegistros(false); }
  };

  const mostrarMensaje = (texto: string, tipo: 'ok' | 'error') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const ficharEntrada = async () => {
    if (!empleadoSelec) {
      mostrarMensaje('Selecciona un empleado primero', 'error');
      return;
    }
    try {
      setLoadingFichaje(true);
      const res = await asistenciaService.registrarEntrada(empleadoSelec);
      mostrarMensaje(res.mensaje || 'Entrada registrada ✅', 'ok');
      cargarRegistros();
    } catch (e: any) {
      mostrarMensaje(
        e.response?.data?.message || 'Error al registrar entrada',
        'error'
      );
    } finally { setLoadingFichaje(false); }
  };

  const ficharSalida = async () => {
    if (!empleadoSelec) {
      mostrarMensaje('Selecciona un empleado primero', 'error');
      return;
    }
    try {
      setLoadingFichaje(true);
      const res = await asistenciaService.registrarSalida(empleadoSelec);
      mostrarMensaje(res.mensaje || 'Salida registrada ✅', 'ok');
      cargarRegistros();
    } catch (e: any) {
      mostrarMensaje(
        e.response?.data?.message || 'Error al registrar salida',
        'error'
      );
    } finally { setLoadingFichaje(false); }
  };

  const formatHora = (fecha?: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour:   '2-digit',
      minute: '2-digit',
    });
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day:   '2-digit',
      month: '2-digit',
      year:  'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Asistencia</h2>
        <p className="text-gray-500 mt-1">Registro de entrada y salida de empleados</p>
      </div>

      {/* Toast de mensaje */}
      {mensaje && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          mensaje.tipo === 'ok'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Panel de fichaje */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Registrar Asistencia
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Empleado
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

          <div className="flex gap-3">
            <button
              onClick={ficharEntrada}
              disabled={loadingFichaje}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {loadingFichaje ? '...' : '✅ Entrada'}
            </button>
            <button
              onClick={ficharSalida}
              disabled={loadingFichaje}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm font-medium"
            >
              {loadingFichaje ? '...' : '🚪 Salida'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtro y tabla de registros */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Registros de Asistencia
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Mes:</label>
            <input
              type="month"
              value={filtroMes}
              onChange={e => setFiltroMes(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loadingRegistros ? (
          <div className="text-center py-8 text-gray-400">
            Cargando registros...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Empleado','Departamento','Fecha','Entrada','Salida','Horas','Tardanza','Estado']
                  .map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No hay registros para este mes.
                  </td>
                </tr>
              ) : registros.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {r.empleado?.apellidos}, {r.empleado?.nombres}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {r.empleado?.departamento?.nombre || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatFecha(r.fecha)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatHora(r.horaEntrada)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatHora(r.horaSalida)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {r.horasTrabajadas ? `${r.horasTrabajadas}h` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {r.minutosTarde > 0 ? `${r.minutosTarde} min` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      BADGE[r.estado] || 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}