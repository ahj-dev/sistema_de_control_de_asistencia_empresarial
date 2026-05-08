/// Página de gestión de departamentos: listado, creación, edición y desactivación

'use client';

import { useEffect, useState } from 'react';
import { departamentosService } from '@/services/departamentos.service';

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [modalAbierto,  setModalAbierto]  = useState(false);
  const [editando,      setEditando]      = useState<any>(null);
  const [form,          setForm]          = useState({ nombre: '', descripcion: '' });
  const [guardando,     setGuardando]     = useState(false);
  const [error,         setError]         = useState('');
  const [mensaje,       setMensaje]       = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      setDepartamentos(await departamentosService.getAll());
    } catch { setError('Error al cargar departamentos'); }
    finally  { setLoading(false); }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: '', descripcion: '' });
    setModalAbierto(true);
  };

  const abrirEditar = (dep: any) => {
    setEditando(dep);
    setForm({ nombre: dep.nombre, descripcion: dep.descripcion || '' });
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return;
    try {
      setGuardando(true);
      if (editando) {
        await departamentosService.update(editando.id, form);
        mostrarMensaje('Departamento actualizado ✅');
      } else {
        await departamentosService.create(form);
        mostrarMensaje('Departamento creado ✅');
      }
      setModalAbierto(false);
      cargar();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const eliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Desactivar el departamento "${nombre}"?`)) return;
    try {
      await departamentosService.remove(id);
      mostrarMensaje('Departamento desactivado');
      cargar();
    } catch { alert('Error al eliminar'); }
  };

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🏢 Departamentos</h2>
          <p className="text-gray-500 mt-1">Gestión de departamentos de la empresa</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Nuevo Departamento
        </button>
      </div>

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {mensaje}
        </div>
      )}

      {/* Error */}
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
                {['Nombre', 'Descripción', 'Empleados', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departamentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay departamentos. Crea el primero.
                  </td>
                </tr>
              ) : departamentos.map(dep => (
                <tr key={dep.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {dep.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {dep.descripcion || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {dep._count?.empleados ?? 0} empleados
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      dep.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {dep.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => abrirEditar(dep)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(dep.id, dep.nombre)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editando ? 'Editar Departamento' : 'Nuevo Departamento'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Tecnología"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción opcional"
                  rows={3}
                />
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
                disabled={guardando || !form.nombre.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}