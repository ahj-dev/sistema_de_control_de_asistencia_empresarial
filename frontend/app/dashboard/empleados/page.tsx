/// Página de gestión de empleados: listado, creación y desactivación

'use client';

import { useEffect, useState } from 'react';
import { empleadosService }     from '@/services/empleados.service';
import { departamentosService } from '@/services/departamentos.service';
import { horariosService }      from '@/services/horarios.service';

const formInicial = {
  nombres:         '',
  apellidos:       '',
  cedula:          '',
  telefono:        '',
  fechaIngreso:    '',
  fechaNacimiento: '',
  departamentoId:  '',
  horarioId:       '',
};

const BADGE_ESTADO: Record<string, string> = {
  ACTIVO:     'bg-green-100 text-green-700',
  INACTIVO:   'bg-red-100 text-red-700',
  SUSPENDIDO: 'bg-yellow-100 text-yellow-700',
  VACACIONES: 'bg-blue-100 text-blue-700',
};

export default function EmpleadosPage() {
  const [empleados,     setEmpleados]     = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [horarios,      setHorarios]      = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [modalAbierto,  setModalAbierto]  = useState(false);
  const [guardando,     setGuardando]     = useState(false);
  const [form,          setForm]          = useState(formInicial);
  const [error,         setError]         = useState('');
  const [mensaje,       setMensaje]       = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [emp, dep, hor] = await Promise.all([
        empleadosService.getAll(),
        departamentosService.getAll(),
        horariosService.getAll(),
      ]);
      setEmpleados(emp);
      setDepartamentos(dep);
      setHorarios(hor);
    } catch { setError('Error al cargar los datos'); }
    finally  { setLoading(false); }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const abrirModal = () => {
    setForm(formInicial);
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombres || !form.apellidos || !form.cedula ||
        !form.fechaIngreso || !form.departamentoId) {
      alert('Completa todos los campos obligatorios (*)');
      return;
    }
    try {
      setGuardando(true);
      await empleadosService.create({
        nombres:         form.nombres,
        apellidos:       form.apellidos,
        cedula:          form.cedula,
        telefono:        form.telefono   || undefined,
        fechaIngreso:    form.fechaIngreso,
        fechaNacimiento: form.fechaNacimiento || undefined,
        departamentoId:  form.departamentoId,
        horarioId:       form.horarioId || undefined,
      });
      setModalAbierto(false);
      mostrarMensaje('Empleado creado exitosamente ✅');
      cargarDatos();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const desactivar = async (id: string, nombre: string) => {
    if (!confirm(`¿Desactivar al empleado "${nombre}"?`)) return;
    try {
      await empleadosService.remove(id);
      mostrarMensaje('Empleado desactivado');
      cargarDatos();
    } catch { alert('Error al desactivar'); }
  };

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Empleados</h2>
          <p className="text-gray-500 mt-1">
            {empleados.length} empleado{empleados.length !== 1 ? 's' : ''} activo{empleados.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={abrirModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          + Nuevo Empleado
        </button>
      </div>

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Empleado', 'Cédula', 'Departamento', 'Horario', 'Ingreso', 'Estado', 'Acciones']
                  .map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empleados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No hay empleados registrados. Crea el primero.
                  </td>
                </tr>
              ) : empleados.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {emp.apellidos}, {emp.nombres}
                    </div>
                    {emp.telefono && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        📞 {emp.telefono}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {emp.cedula}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {emp.departamento?.nombre || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {emp.horario?.nombre || (
                      <span className="text-amber-500 text-xs">Sin horario</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(emp.fechaIngreso).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      BADGE_ESTADO[emp.estado] || 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => desactivar(emp.id, `${emp.nombres} ${emp.apellidos}`)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear empleado */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Nuevo Empleado
            </h3>

            <div className="space-y-3">
              {/* Nombres y apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={form.nombres}
                    onChange={e => setForm({ ...form, nombres: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Juan Carlos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={form.apellidos}
                    onChange={e => setForm({ ...form, apellidos: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="García López"
                  />
                </div>
              </div>

              {/* Cédula y teléfono */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula *
                  </label>
                  <input
                    type="text"
                    value={form.cedula}
                    onChange={e => setForm({ ...form, cedula: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={form.telefono}
                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="3001234567"
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Ingreso *
                  </label>
                  <input
                    type="date"
                    value={form.fechaIngreso}
                    onChange={e => setForm({ ...form, fechaIngreso: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <select
                  value={form.departamentoId}
                  onChange={e => setForm({ ...form, departamentoId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar departamento...</option>
                  {departamentos.map(dep => (
                    <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario Laboral
                  <span className="text-gray-400 font-normal ml-1">(requerido para registrar asistencia)</span>
                </label>
                <select
                  value={form.horarioId}
                  onChange={e => setForm({ ...form, horarioId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sin horario asignado</option>
                  {horarios.map(hor => (
                    <option key={hor.id} value={hor.id}>
                      {hor.nombre} ({hor.horaEntrada} - {hor.horaSalida})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 text-gray-600 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
              >
                {guardando ? 'Guardando...' : 'Guardar Empleado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}