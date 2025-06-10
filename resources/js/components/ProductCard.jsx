import React, { useState } from 'react';
import { FaEdit, FaTrash, FaImage, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import { formatPrice, getCurrencySymbol } from '../data/currencies';

function ProductCard({ producto, onEdit, onDelete, index }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-700 overflow-hidden border border-gray-100 animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Action Buttons */}
      <div className={`absolute top-4 right-4 z-20 flex flex-col space-y-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 ${
            isLiked
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <FaHeart className="text-sm" />
        </button>
        <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 text-gray-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg">
          <FaEye className="text-sm" />
        </button>
      </div>

      {/* Premium Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
          <FaStar className="text-xs" />
          <span>Premium</span>
        </div>
      </div>

      {/* Image Section with Overlay */}
      <div className="relative overflow-hidden h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <>
            <img
              src={`/storage/${producto.imagenes[0]}`}
              alt={`Imagen de ${producto.nombre}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-gradient-shift"></div>
            <FaImage className="text-6xl text-blue-300 relative z-10 animate-pulse" />
          </div>
        )}

        {/* Floating Price Tag */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/20">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(producto.precio, producto.moneda)}
            </span>
            <span className="text-sm text-gray-600 ml-1">{producto.moneda}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        {/* Category Tag */}
        <div className="absolute -top-3 left-6 z-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
            {producto.categoria}
          </div>
        </div>

        <div className="pt-4">
          {/* Product Name */}
          <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {producto.nombre}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {producto.descripcion || "Descripción no disponible"}
          </p>

          {/* Rating Stars */}
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
            <span className="text-gray-500 text-sm ml-2">(4.8)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 group/btn"
            >
              <FaEdit className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
              <span>Editar</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25 group/btn"
            >
              <FaTrash className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-700 pointer-events-none"></div>
    </div>
  );
}

export default ProductCard;
