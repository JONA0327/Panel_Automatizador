import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { FaPlus, FaSearch, FaShoppingBasket, FaEdit, FaTrash } from "react-icons/fa";

import Navigation from "./components/Navigation";
import EditPackageModal from "./components/EditPackageModal";
import DeletePackageModal from "./components/DeletePackageModal";

// Componente para productos seleccionables
function SelectableProduct({ producto, onSelect }) {
    return (
        <div
            onClick={() => onSelect(producto)}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300 select-none cursor-pointer"
            title="Agregar al paquete"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {producto.imagenes && producto.imagenes.length > 0 ? (
                        <img
                            src={`/storage/${producto.imagenes[0]}`}
                            alt={producto.nombre}
                            className="w-10 h-10 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaShoppingBasket className="text-gray-400 text-sm" />
                        </div>
                    )}
                    <span className="font-medium text-gray-800">
                        {producto.nombre}
                    </span>
                </div>
                <span className="text-green-600 font-semibold">
                    ${producto.precio}
                </span>
            </div>
        </div>
        </>
    );
}

// Componente para productos en el paquete
function PackageProduct({ producto, onRemove, onEdit }) {
    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
                {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                        src={`/storage/${producto.imagenes[0]}`}
                        alt={producto.nombre}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaShoppingBasket className="text-gray-400" />
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-800 block">
                        {producto.nombre}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                        ${producto.precio}
                    </span>
                </div>
            </div>

            {/* Action Buttons - Exactamente igual que ProductCard */}
            <div className="flex space-x-3">
                <button
                    onClick={() => onEdit(producto)}
                    className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 group/btn"
                >
                    <FaEdit className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>Editar</span>
                </button>
                <button
                    onClick={() => onRemove(producto._id || producto.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25 group/btn"
                >
                    <FaTrash className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    );
}


function PackageApp() {
    const [productos, setProductos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [packageName, setPackageName] = useState("");
    const [packageDescription, setPackageDescription] = useState("");
    const [discount, setDiscount] = useState(0);
    const [paquetes, setPaquetes] = useState([]);
    const [editingPackage, setEditingPackage] = useState(null);
    const [deletingPackage, setDeletingPackage] = useState(null);

    useEffect(() => {
        fetchProductos();
        fetchPaquetes();
    }, []);

    const fetchProductos = async () => {
        try {
            const res = await fetch("/productos", {
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error("Error al obtener productos");
            const data = await res.json();
            setProductos(data);
        } catch (e) {
            alert("Error cargando productos: " + e.message);
        }
    };

    const fetchPaquetes = async () => {
        try {
            const res = await fetch("/api/paquetes", {
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error("Error al obtener paquetes");
            const data = await res.json();
            setPaquetes(data);
        } catch (e) {
            alert("Error cargando paquetes: " + e.message);
        }
    };

    // Agrupar productos por categoría
    const productosPorCategoria = productos.reduce((acc, producto) => {
        if (!producto.categoria) return acc;
        if (!acc[producto.categoria]) {
            acc[producto.categoria] = [];
        }
        acc[producto.categoria].push(producto);
        return acc;
    }, {});

    // Permite seleccionar varios productos, independiente de la categoría
    const handleSelectProduct = (producto) => {
        const id = producto._id || producto.id;
        if (!selectedProducts.some((p) => (p._id || p.id) == id)) {
            setSelectedProducts([...selectedProducts, producto]);
        }
    };

    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce(
            (sum, product) => sum + parseFloat(product.precio || 0),
            0
        );
        const discountAmount = (subtotal * discount) / 100;
        return subtotal - discountAmount;
    };

    const removeProductFromPackage = (productId) => {
        setSelectedProducts(
            selectedProducts.filter((p) => (p._id || p.id) != productId)
        );
    };

    const handleSavePackage = async () => {
        if (!packageName || selectedProducts.length === 0) {
            alert(
                "Por favor complete el nombre del paquete y agregue productos"
            );
            return;
        }
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            const response = await fetch("/api/paquetes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    nombre: packageName,
                    descripcion: packageDescription,
                    precio_total: calculateTotal(),
                    productos: selectedProducts.map((p) => p._id || p.id),
                    descuento: discount,
                    moneda: "MXN",
                }),
            });
            if (!response.ok) throw new Error("Error al guardar el paquete");
            alert("Paquete guardado exitosamente");
            setSelectedProducts([]);
            setPackageName("");
            setPackageDescription("");
            setDiscount(0);
            fetchPaquetes();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEditPackage = (id) => {
        const pack = paquetes.find((p) => (p._id || p.id) == id);
        if (pack) setEditingPackage(pack);
    };

    const handleDeletePackage = (id) => {
        const pack = paquetes.find((p) => (p._id || p.id) == id);
        if (pack) setDeletingPackage(pack);
    };

    const confirmDeletePackage = async () => {
        if (!deletingPackage) return;
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            const res = await fetch(`/api/paquetes/${deletingPackage._id || deletingPackage.id}`, {
                method: "DELETE",
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
            if (!res.ok) throw new Error("Error al eliminar paquete");
            setDeletingPackage(null);
            fetchPaquetes();
        } catch (e) {
            alert(e.message);
        }
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {editingPackage && (
                <EditPackageModal
                    paquete={editingPackage}
                    productosDisponibles={productos}
                    onClose={() => setEditingPackage(null)}
                    onUpdated={fetchPaquetes}
                />
            )}
            {deletingPackage && (
                <DeletePackageModal
                    paquete={deletingPackage}
                    onClose={() => setDeletingPackage(null)}
                    onConfirm={confirmDeletePackage}
                />
            )}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navigation />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                            Creador de
                            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Paquetes
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                            Haz clic en los productos para agregarlos al paquete
                            personalizado con descuentos especiales.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="flex gap-8">
                    {/* Sidebar with products */}
                    <div className="w-1/3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaShoppingBasket className="mr-3 text-blue-600" />
                                Productos Disponibles
                            </h2>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-6 max-h-96 overflow-y-auto">
                            {Object.entries(productosPorCategoria).map(
                                ([categoria, productos]) => (
                                    <div key={categoria}>
                                        <h3 className="text-lg font-bold text-blue-700 mb-3 border-l-4 border-blue-400 pl-3">
                                            {categoria}
                                        </h3>
                                        <div className="space-y-2">
                                            {productos
                                                .filter((p) =>
                                                    p.nombre
                                                        ?.toLowerCase()
                                                        .includes(
                                                            searchTerm.toLowerCase()
                                                        )
                                                )
                                                .map((producto, index) => (
                                                    <SelectableProduct
                                                        key={`${
                                                            producto._id ||
                                                            producto.id
                                                        }-${index}`}
                                                        producto={producto}
                                                        onSelect={
                                                            handleSelectProduct
                                                        }
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Package builder */}
                    <div className="w-2/3 space-y-6">
                        {/* Package Form */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaPlus className="mr-3 text-green-600" />
                                Crear Nuevo Paquete
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre del paquete"
                                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
                                    value={packageName}
                                    onChange={(e) =>
                                        setPackageName(e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Descuento (%)"
                                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/90"
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(e.target.value)
                                    }
                                />
                            </div>
                            <textarea
                                placeholder="Descripción del paquete"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-4 bg-white/90"
                                rows="3"
                                value={packageDescription}
                                onChange={(e) =>
                                    setPackageDescription(e.target.value)
                                }
                            />
                        </div>

                        {/* Package Drop Zone */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 min-h-96 transition-all duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Productos en el paquete (
                                    {selectedProducts.length})
                                </h3>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                        Subtotal: $
                                        {selectedProducts
                                            .reduce(
                                                (sum, p) =>
                                                    sum +
                                                    parseFloat(p.precio || 0),
                                                0
                                            )
                                            .toFixed(2)}
                                    </div>
                                    {discount > 0 && (
                                        <div className="text-sm text-red-600">
                                            Descuento ({discount}%): -$
                                            {(
                                                (selectedProducts.reduce(
                                                    (sum, p) =>
                                                        sum +
                                                        parseFloat(
                                                            p.precio || 0
                                                        ),
                                                    0
                                                ) *
                                                    discount) /
                                                100
                                            ).toFixed(2)}
                                        </div>
                                    )}
                                    <div className="text-2xl font-bold text-green-600">
                                        Total: ${calculateTotal().toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {selectedProducts.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                                    <FaShoppingBasket className="mx-auto text-6xl text-gray-400 mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        Haz clic en los productos para
                                        agregarlos aquí
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedProducts.map((product, index) => (
                                        <PackageProduct
                                            key={`package-${
                                                product._id || product.id
                                            }-${index}`}
                                            producto={product}
                                            onRemove={removeProductFromPackage}
                                            onEdit={handleEditPackage}
                                        />
                                    ))}
                                </div>
                            )}

                            {selectedProducts.length > 0 && (
                                <button
                                    onClick={handleSavePackage}
                                    className="mt-6 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-500"
                                >
                                    Guardar Paquete
                                </button>
                            )}
                        </div>

                        {/* Existing Packages Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Paquetes Existentes
                            </h2>
                            <div className="space-y-4">
                                {paquetes.map((paquete) => (
                                    <div
                                        key={paquete.id}
                                        className="border-b pb-2"
                                    >
                                        <h3 className="font-semibold text-gray-700">
                                            {paquete.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {paquete.descripcion}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Precio: ${paquete.precio_total} {paquete.moneda}
                                        </p>
                                        {Array.isArray(paquete.productos_detalle) && (
                                            <ul className="mt-2 space-y-1 pl-4 list-disc">
                                                {paquete.productos_detalle.map((prod) => (
                                                    <li key={prod._id || prod.id} className="flex items-center space-x-2">
                                                        {prod.imagenes && prod.imagenes.length > 0 && (
                                                            <img
                                                                src={`/storage/${prod.imagenes[0]}`}
                                                                alt={prod.nombre}
                                                                className="w-6 h-6 object-cover rounded"
                                                                onError={(e) => (e.target.style.display = 'none')}
                                                            />
                                                        )}
                                                        <span>{prod.nombre}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="flex space-x-2 mt-3">
                                            <button
                                                onClick={() => handleEditPackage(paquete._id || paquete.id)}
                                                className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
                                                title="Editar paquete"
                                            >
                                                <FaEdit className="text-sm" />
                                                <span>Editar</span>
                                            </button>

                                            <button
                                                onClick={() => handleDeletePackage(paquete._id || paquete.id)}
                                                className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-red-600 hover:via-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25"
                                                title="Eliminar paquete"
                                            >
                                                <FaTrash className="text-sm" />
                                                <span>Eliminar</span>
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

// Mount the component
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<PackageApp />);
