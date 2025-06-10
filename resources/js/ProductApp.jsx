import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import Navigation from './components/Navigation';

function ProductApp() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/productos', { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      alert("Error cargando productos: " + e.message);
    }
  };

  const handleProductoCreado = () => {
    fetchProductos();
    setShowModal(false);
  };

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setShowEditModal(true);
  };

  const handleDeleteProducto = (producto) => {
    setSelectedProducto(producto);
    setShowDeleteModal(true);
  };

  const confirmDeleteProducto = async () => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch(`/productos/${selectedProducto.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      alert('Producto eliminado correctamente.');
      fetchProductos();
    } catch (error) {
      alert(error.message || 'Error de conexión al servidor.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Filtros y seguridad: solo productos con categoría definida
  const filteredProductos = productos.filter(producto => {
    if (!producto.categoria) return false;
    const matchesSearch =
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar productos por categoría
  const productosPorCategoria = {};
  filteredProductos.forEach(producto => {
    if (!producto.categoria) return;
    if (!productosPorCategoria[producto.categoria]) {
      productosPorCategoria[producto.categoria] = [];
    }
    productosPorCategoria[producto.categoria].push(producto);
  });

  // Lista de categorías para el filtro
  const categories = [...new Set(productos.filter(p => p.categoria).map(p => p.categoria))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Gestión de
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Productos
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Administra tu inventario con estilo y eficiencia. Diseño moderno para una experiencia excepcional.
            </p>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white/90 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-12 pr-8 py-4 rounded-2xl border-0 bg-white/90 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Product Button */}
            <button
              className="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-500 flex items-center space-x-3 mx-auto animate-fade-in-up animation-delay-600"
              onClick={() => setShowModal(true)}
            >
              <div className="relative">
                <FaPlus className="group-hover:rotate-180 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
              <span>Añadir Producto</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in-up">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{productos.length}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-gray-800 font-semibold">Productos</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in-up animation-delay-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{categories.length}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-gray-800 font-semibold">Categorías</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in-up animation-delay-400">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{filteredProductos.length}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Productos</p>
                <p className="text-gray-800 font-semibold">Filtrados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Productos agrupados por categoría */}
        {Object.keys(productosPorCategoria).length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-500">Agrega tu primer producto para comenzar</p>
          </div>
        )}

        {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
          <div key={categoria} className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 border-l-4 border-blue-400 pl-4 bg-blue-50 py-2 rounded-r-xl shadow">
              {categoria}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.isArray(productos) && productos.map((producto, index) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onEdit={() => handleEditProducto(producto)}
                  onDelete={() => handleDeleteProducto(producto)}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onProductoCreado={handleProductoCreado}
        />
      )}

      {showEditModal && selectedProducto && (
        <EditProductModal
          producto={selectedProducto}
          onClose={() => setShowEditModal(false)}
          onProductoEditado={fetchProductos}
        />
      )}

      {showDeleteModal && selectedProducto && (
        <DeleteConfirmationModal
          producto={selectedProducto}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteProducto}
        />
      )}
    </div>
  );
}

// MONTA EL COMPONENTE EN EL DOM
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<ProductApp />);
