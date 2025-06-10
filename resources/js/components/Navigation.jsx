import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Productos', href: '/productos' },
    { name: 'Paquetes', href: '/paquetes' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Índice de Enfermedades', href: '/enfermedades' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center space-x-2 py-4">
          {menuItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative px-6 py-3 text-white font-medium transition-all duration-500 hover:scale-105 transform"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="relative z-10 transition-all duration-300 group-hover:text-blue-100">
                {item.name}
              </span>

              {/* Hover Background */}
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm transform scale-95 group-hover:scale-100"></div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-500 rounded-full"></div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-xl transition-all duration-500 blur-sm"></div>
            </a>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-between items-center py-4">
          <div className="text-white font-bold text-xl">Menu</div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-blue-800/95 backdrop-blur-sm border-t border-white/10 animate-slide-down">
            <div className="py-4 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block w-full text-left px-6 py-3 text-white hover:bg-white/10 transition-colors duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
