// Página de gestión de horarios laborales
// Permite crear, editar y eliminar horarios con días laborables y tolerancia 
'use client';

import { useEffect, useState } from 'react';
import { horariosService } from '@/services/horarios.service';

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];

const formInicial = {
  nombre:        '',
  horaEntrada:   '08:00',
  horaSalida:    '17:00',
  toleranciaMin: 10,
  diasLaborables: {
    lunes: true, martes: true, miercoles: true,
    jueves: true, viernes: true, sabado: false, domingo: false,
  },
};

export default function HorariosPage() {
  const [horarios,      setHorarios]      = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [modalAbierto,  setModalAbierto]  = useState(false);
  const [editando,      setEditando]      = useState<any>(null);
  const [form,          setForm]          = useState(formInicial);
  const [guardando,     setGuardando]     = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      setHorarios(await horariosService.getAll());
    } catch { setError('Error al cargar horarios'); }
    finally  { setLoading(false); }
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm(formInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (h: any) => {
    setEditando(h);
    setForm({
      nombre:         h.nombre,
      horaEntrada:    h.horaEntrada,
      horaSalida:     h.horaSalida,
      toleranciaMin:  h.toleranciaMin,
      diasLaborables: h.diasLaborables,
    });
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return;
    try {
      setGuardando(true);
      if (editando) {
        await horariosService.update(editando.id, form);
      } else {
        await horariosService.create(form);
      }
      setModalAbierto(false);
      cargar();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const eliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Desactivar el horario "${nombre}"?`)) return;
    try {
      await horariosService.remove(id);
      cargar();
    } catch { alert('Error al eliminar'); }
  };

  const toggleDia = (dia: string) => {
    setForm(prev => ({
      ...prev,
      diasLaborables: {
        ...prev.diasLaborables,
        [dia]: !(prev.diasLaborables as any)[dia],
      },
    }));
  };

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🕐 Horarios Laborales</h2>
          <p className="text-gray-500 mt-1">Gestión de turnos de trabajo</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Nuevo Horario
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
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
                {['Nombre','Entrada','Salida','Tolerancia','Días laborables','Estado','Acciones']
                  .map(h => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {horarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No hay horarios. Crea el primero.
                  </td>
                </tr>
              ) : horarios.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{h.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{h.horaEntrada}</td>
                  <td className="px-6 py-4 text-gray-600">{h.horaSalida}</td>
                  <td className="px-6 py-4 text-gray-600">{h.toleranciaMin} min</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {DIAS.map(dia => (
                        <span
                          key={dia}
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            h.diasLaborables?.[dia]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {dia.slice(0,3)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      h.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {h.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => abrirEditar(h)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(h.id, h.nombre)}
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
              {editando ? 'Editar Horario' : 'Nuevo Horario'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Turno Mañana"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Entrada *</label>
                  <input
                    type="time"
                    value={form.horaEntrada}
                    onChange={e => setForm({ ...form, horaEntrada: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Salida *</label>
                  <input
                    type="time"
                    value={form.horaSalida}
                    onChange={e => setForm({ ...form, horaSalida: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tolerancia (minutos)
                </label>
                <input
                  type="number"
                  value={form.toleranciaMin}
                  onChange={e => setForm({ ...form, toleranciaMin: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                  max={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Laborables
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIAS.map(dia => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        (form.diasLaborables as any)[dia]
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {dia.slice(0,3).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-700"
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