import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FaNotesMedical, FaEdit, FaTrash } from 'react-icons/fa';
import Navigation from './components/Navigation';
import EditDiseaseModal from './components/EditDiseaseModal';
import DeleteDiseaseModal from './components/DeleteDiseaseModal';

function DiseaseApp() {
  const [enfermedades, setEnfermedades] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [paqueteId, setPaqueteId] = useState('');
  const [dosages, setDosages] = useState({});
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEnfermedades();
    fetchPaquetes();
  }, []);

  const fetchEnfermedades = async () => {
    try {
      const res = await fetch('/api/enfermedades', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Error al obtener enfermedades');
      const data = await res.json();
      setEnfermedades(data);
    } catch (e) {
      alert(e.message);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const res = await fetch('/api/paquetes', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Error al obtener paquetes');
      const data = await res.json();
      setPaquetes(data);
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePackageChange = (id) => {
    setPaqueteId(id);
    setDosages({});
  };

  const handleDosageChange = (pid, val) => {
    setDosages((prev) => ({ ...prev, [pid]: val }));
  };

  const handleSaveDisease = async () => {
    if (!nombre || !paqueteId) {
      alert('Complete el nombre y seleccione paquete');
      return;
    }
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const res = await fetch('/api/enfermedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({
          nombre,
          descripcion,
          paquete_id: paqueteId,
          dosis: Object.entries(dosages).map(([producto_id, dosis]) => ({ producto_id, dosis }))
        })
      });
      if (!res.ok) throw new Error('Error al guardar enfermedad');
      setNombre('');
      setDescripcion('');
      setPaqueteId('');
      setDosages({});
      fetchEnfermedades();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEditDisease = (id) => {
    const enf = enfermedades.find((e) => (e._id || e.id) == id);
    if (enf) setEditing(enf);
  };

  const handleDeleteDisease = (id) => {
    const enf = enfermedades.find((e) => (e._id || e.id) == id);
    if (enf) setDeleting(enf);
  };

  const confirmDeleteDisease = async () => {
    if (!deleting) return;
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const res = await fetch(`/api/enfermedades/${deleting._id || deleting.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrf }
      });
      if (!res.ok) throw new Error('Error al eliminar enfermedad');
      setDeleting(null);
      fetchEnfermedades();
    } catch (e) {
      alert(e.message);
    }
  };

  const selectedPackage = paquetes.find((p) => (p._id || p.id) == paqueteId);

  return (
    <>
      {editing && (
        <EditDiseaseModal
          enfermedad={editing}
          paquetes={paquetes}
          onClose={() => setEditing(null)}
          onUpdated={fetchEnfermedades}
        />
      )}
      {deleting && (
        <DeleteDiseaseModal
          enfermedad={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={confirmDeleteDisease}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h1 className="text-4xl font-bold mb-6 flex items-center">
            <FaNotesMedical className="mr-3 text-red-600" /> Índice de Enfermedades
          </h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
                placeholder="Nombre de la enfermedad"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <select
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
                value={paqueteId}
                onChange={(e) => handlePackageChange(e.target.value)}
              >
                <option value="">Seleccione paquete</option>
                {paquetes.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full mt-4 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
              rows="3"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            {selectedPackage && Array.isArray(selectedPackage.productos_detalle) && (
              <div className="mt-4 space-y-2">
                {selectedPackage.productos_detalle.map((prod) => (
                  <div key={prod._id || prod.id} className="flex items-center space-x-3">
                    <span className="flex-1">{prod.nombre}</span>
                    <input
                      type="text"
                      className="p-2 border rounded"
                      placeholder="Dosis"
                      value={dosages[prod._id || prod.id] || ''}
                      onChange={(e) => handleDosageChange(prod._id || prod.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleSaveDisease}
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-3 rounded-xl font-bold shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-500"
            >
              Guardar Enfermedad
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Enfermedades Registradas</h2>
            <div className="space-y-4">
              {enfermedades.map((enf) => (
                <div key={enf._id || enf.id} className="border-b pb-2">
                  <h3 className="font-semibold text-gray-700">{enf.nombre}</h3>
                  <p className="text-sm text-gray-500">{enf.descripcion}</p>
                  {enf.paquete && <p className="text-sm text-gray-600">Paquete: {enf.paquete.nombre}</p>}
                  {Array.isArray(enf.dosis) && enf.dosis.length > 0 && (
                    <ul className="pl-4 list-disc mt-2 space-y-1">
                      {enf.dosis.map((d) => {
                        const prod = enf.paquete?.productos_detalle?.find((p) => (p._id || p.id) == d.producto_id);
                        return (
                          <li key={d.producto_id} className="text-sm flex items-center space-x-2">
                            {prod && prod.imagenes && prod.imagenes[0] && (
                              <img

                                src={`/storage/${prod.imagenes[0]}`}

                                alt={prod.nombre}
                                className="w-5 h-5 object-cover rounded"
                                onError={(e) => (e.target.style.display = 'none')}
                              />
                            )}
                            <span>{prod ? prod.nombre : d.producto_id}: {d.dosis}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleEditDisease(enf._id || enf.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
                    >
                      <FaEdit className="text-sm" /> <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDisease(enf._id || enf.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-red-600 hover:via-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25"
                    >
                      <FaTrash className="text-sm" /> <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<DiseaseApp />);
