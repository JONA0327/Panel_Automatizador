import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { categories } from '../data/categories';
import { currencies } from '../data/currencies';

function EditProductModal({ producto, onClose, onProductoEditado }) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precio, setPrecio] = useState(producto.precio);
  const [moneda, setMoneda] = useState(producto.moneda || 'USD');
  const [categoria, setCategoria] = useState(producto.categoria);
  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [productosCategoria, setProductosCategoria] = useState(categories[producto.categoria] || []);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  const handleCategoriaChange = (e) => {
    const selectedCategoria = e.target.value;
    setCategoria(selectedCategoria);
    setProductosCategoria(categories[selectedCategoria] || []);
    setNombre('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);

    // Crear URLs de vista previa
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio) {
      alert('El nombre y precio son obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('moneda', moneda);
    formData.append('categoria', categoria);
    imagenes.forEach((file) => {
      formData.append('imagenes[]', file);
    });

    try {
      const response = await fetch(`/productos/${producto.id}`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-HTTP-Method-Override': 'PUT',
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error actualizando producto: ' + errorData.message);
        return;
      }
      await response.json();
      alert('Producto actualizado correctamente.');
      if (onProductoEditado) onProductoEditado();
      onClose();
    } catch (error) {
      alert('Error de conexión al servidor.');
    }
  };

  // Imágenes actuales del producto (si existen)
  const imagenesActuales = producto.imagenes || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Editar Producto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
              <select
                name="categoria"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={categoria}
                onChange={handleCategoriaChange}
              >
                <option value="">Seleccione una categoría</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nombre del Producto</label>
              <select
                name="nombre"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 disabled:bg-gray-100"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={!categoria}
              >
                <option value="">Seleccione un producto</option>
                {productosCategoria.map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Descripción del Producto</label>
            <textarea
              name="descripcion"
              rows="4"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe las características del producto..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Precio</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Moneda</label>
              <select
                name="moneda"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={moneda}
                onChange={e => setMoneda(e.target.value)}
              >
                {Object.entries(currencies).map(([code, currency]) => (
                  <option key={code} value={code}>
                    {code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Imágenes</label>
            <input
              name="imagenes[]"
              type="file"
              multiple
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
              accept="image/*"
            />
            {/* Vista previa de nuevas imágenes */}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previewUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Vista previa ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border shadow"
                  />
                ))}
              </div>
            )}
            {/* Vista previa de imágenes actuales si no hay nuevas */}
            {previewUrls.length === 0 && producto.imagenes && producto.imagenes.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {producto.imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={`/storage/${img}`}
                    alt={`Imagen actual ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border shadow"
                  />
                ))}
              </div>
            )}
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Actualizar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
