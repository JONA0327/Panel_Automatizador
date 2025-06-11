import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function EditPackageModal({ paquete, productosDisponibles, onClose, onUpdated }) {
  const [nombre, setNombre] = useState(paquete.nombre);
  const [descripcion, setDescripcion] = useState(paquete.descripcion);
  const [descuento, setDescuento] = useState(paquete.descuento || 0);
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(paquete.productos)
      ? paquete.productos
      : JSON.parse(paquete.productos || '[]')
  );

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  const toggleProduct = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const subtotal = productosDisponibles
      .filter((p) => selectedIds.includes(p._id || p.id))
      .reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const discountAmount = (subtotal * descuento) / 100;
    return subtotal - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/paquetes/${paquete._id || paquete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio_total: calculateTotal(),
          productos: selectedIds,
          descuento,
          moneda: paquete.moneda || 'MXN',
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar paquete');
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
          <h2 className="text-2xl font-bold">Editar Paquete</h2>
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
              placeholder="Nombre del paquete"
              required
            />
            <input
              type="number"
              className="p-4 border border-gray-200 rounded-xl w-full"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              placeholder="Descuento (%)"
            />
          </div>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl"
            rows="3"
            placeholder="Descripción"
          ></textarea>
          <div className="max-h-60 overflow-y-auto border p-4 rounded-xl space-y-2">
            {productosDisponibles.map((prod) => (
              <label key={prod._id || prod.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(prod._id || prod.id)}
                  onChange={() => toggleProduct(prod._id || prod.id)}
                />
                <span>{prod.nombre}</span>
              </label>
            ))}
          </div>
          <div className="text-right font-semibold text-gray-700">
            Precio total: {calculateTotal().toFixed(2)} {paquete.moneda || 'MXN'}
          </div>
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

export default EditPackageModal;
