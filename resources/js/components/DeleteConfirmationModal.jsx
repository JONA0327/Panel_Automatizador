import React from 'react';

function DeleteConfirmationModal({ producto, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h2>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong className="text-gray-800">{producto.nombre}</strong>?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={onConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
