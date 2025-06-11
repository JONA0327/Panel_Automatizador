import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function EditDiseaseModal({ enfermedad, paquetes, onClose, onUpdated }) {
  const [nombre, setNombre] = useState(enfermedad.nombre);
  const [descripcion, setDescripcion] = useState(enfermedad.descripcion);
  const [paqueteId, setPaqueteId] = useState(enfermedad.paquete_id);
  const [dosages, setDosages] = useState(() => {
    const map = {};
    if (Array.isArray(enfermedad.dosis)) {
      enfermedad.dosis.forEach((d) => {
        map[d.producto_id] = d.dosis;
      });
    }
    return map;
  });

  const selectedPackage = paquetes.find((p) => (p._id || p.id) == paqueteId);
  const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  const handleDosageChange = (pid, val) => {
    setDosages((prev) => ({ ...prev, [pid]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/enfermedades/${enfermedad._id || enfermedad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({
          nombre,
          descripcion,
          paquete_id: paqueteId,
          dosis: Object.entries(dosages).map(([producto_id, dosis]) => ({ producto_id, dosis }))
        })
      });
      if (!res.ok) throw new Error('Error al actualizar enfermedad');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Editar Enfermedad</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              className="p-4 border border-gray-200 rounded-xl w-full"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la enfermedad"
              required
            />
            <select
              className="p-4 border border-gray-200 rounded-xl w-full"
              value={paqueteId}
              onChange={(e) => setPaqueteId(e.target.value)}
            >
              <option value="">Seleccione paquete</option>
              {paquetes.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl"
            rows="3"
            placeholder="Descripción"
          ></textarea>
          {selectedPackage && Array.isArray(selectedPackage.productos_detalle) && (
            <div className="max-h-60 overflow-y-auto border p-4 rounded-xl space-y-2">
              {selectedPackage.productos_detalle.map((prod) => (
                <label key={prod._id || prod.id} className="flex items-center space-x-3">
                  <span className="flex-1">{prod.nombre}</span>
                  <input
                    type="text"
                    className="p-2 border rounded"
                    value={dosages[prod._id || prod.id] || ''}
                    onChange={(e) => handleDosageChange(prod._id || prod.id, e.target.value)}
                  />
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDiseaseModal;
