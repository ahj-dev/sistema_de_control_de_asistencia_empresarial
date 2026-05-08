// Página principal de asistencia
// Permite a los empleados registrar su entrada y salida, y a los administradores ver un resumen mensual de asistencia con estados como presente, tarde, ausente, etc.
'use client';

import { useEffect, useState } from 'react';
import { asistenciaService } from '@/services/asistencia.service';
import { empleadosService }  from '@/services/empleados.service';

const BADGE: Record<string, string> = {
  PRESENTE:      'bg-green-100 text-green-700',
  TARDANZA:      'bg-yellow-100 text-yellow-700',
  AUSENTE:       'bg-red-100 text-red-700',
  JUSTIFICADO:   'bg-blue-100 text-blue-700',
  DIA_FESTIVO:   'bg-purple-100 text-purple-700',
  FIN_DE_SEMANA: 'bg-gray-100 text-gray-500',
};

export default function AsistenciaPage() {
  const [empleados,        setEmpleados]        = useState<any[]>([]);
  const [registros,        setRegistros]        = useState<any[]>([]);
  const [empleadoSelec,    setEmpleadoSelec]    = useState('');
  const [filtroEmpleado,   setFiltroEmpleado]   = useState('');
  const [filtroMes,        setFiltroMes]        = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loadingFichaje,   setLoadingFichaje]   = useState(false);
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null);

  useEffect(() => {
    empleadosService.getAll().then(setEmpleados).catch(console.error);
  }, []);

  useEffect(() => { cargarRegistros(); }, [filtroMes, filtroEmpleado]);

  const cargarRegistros = async () => {
    try {
      setLoadingRegistros(true);
      const data = await asistenciaService.getAll({
        mes:        filtroMes,
        empleadoId: filtroEmpleado || undefined,
      });
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

  // Calcular estadísticas del mes actual
  const stats = {
    presentes:  registros.filter(r => r.estado === 'PRESENTE').length,
    tardanzas:  registros.filter(r => r.estado === 'TARDANZA').length,
    ausentes:   registros.filter(r => r.estado === 'AUSENTE').length,
    totalHoras: registros
      .reduce((acc, r) => acc + (Number(r.horasTrabajadas) || 0), 0)
      .toFixed(1),
  };

  const formatHora = (fecha?: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Asistencia</h2>
        <p className="text-gray-500 mt-1">Registro y consulta de asistencia</p>
      </div>

      {/* Toast */}
      {mensaje && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          mensaje.tipo === 'ok'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Panel de fichaje */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Registrar Asistencia
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
                  {emp.apellidos}, {emp.nombres}
                  {emp.horario ? ` — ${emp.horario.nombre}` : ' ⚠ Sin horario'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={ficharEntrada}
              disabled={loadingFichaje}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold"
            >
              {loadingFichaje ? '...' : '✅ Registrar Entrada'}
            </button>
            <button
              onClick={ficharSalida}
              disabled={loadingFichaje}
              className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm font-semibold"
            >
              {loadingFichaje ? '...' : '🚪 Registrar Salida'}
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas del mes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Presentes',      valor: stats.presentes,  color: 'border-green-500',  text: 'text-green-600' },
          { label: 'Tardanzas',      valor: stats.tardanzas,  color: 'border-yellow-500', text: 'text-yellow-600' },
          { label: 'Ausentes',       valor: stats.ausentes,   color: 'border-red-500',    text: 'text-red-600' },
          { label: 'Horas trabajadas', valor: `${stats.totalHoras}h`, color: 'border-blue-500', text: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${stat.color}`}>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros de la tabla */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base font-semibold text-gray-800">
              Registros — {filtroMes}
              {filtroEmpleado && (
                <span className="ml-2 text-sm text-blue-600 font-normal">
                  (filtrado por empleado)
                </span>
              )}
            </h3>
            <div className="flex gap-3 items-center flex-wrap">
              {/* Filtro por empleado */}
              <select
                value={filtroEmpleado}
                onChange={e => setFiltroEmpleado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los empleados</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.apellidos}, {emp.nombres}
                  </option>
                ))}
              </select>

              {/* Filtro por mes */}
              <input
                type="month"
                value={filtroMes}
                onChange={e => setFiltroMes(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Limpiar filtros */}
              {filtroEmpleado && (
                <button
                  onClick={() => setFiltroEmpleado('')}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla */}
        {loadingRegistros ? (
          <div className="text-center py-8 text-gray-400">
            Cargando registros...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Empleado', 'Departamento', 'Fecha', 'Entrada', 'Salida', 'Horas', 'Tardanza', 'Estado']
                    .map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registros.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      No hay registros para los filtros seleccionados.
                    </td>
                  </tr>
                ) : registros.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">
                        {r.empleado?.apellidos}, {r.empleado?.nombres}
                      </div>
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
                    <td className="px-4 py-3 text-sm">
                      {r.minutosTarde > 0 ? (
                        <span className="text-yellow-600 font-medium">
                          {r.minutosTarde} min
                        </span>
                      ) : '—'}
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
          </div>
        )}

        {/* Total de registros */}
        {registros.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Total: <span className="font-medium text-gray-700">{registros.length} registros</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}