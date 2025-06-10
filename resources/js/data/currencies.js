export const currencies = {
  // América del Norte
  'USD': { name: 'Dólar Estadounidense', symbol: '$', country: 'Estados Unidos' },
  'CAD': { name: 'Dólar Canadiense', symbol: 'C$', country: 'Canadá' },
  'MXN': { name: 'Peso Mexicano', symbol: '$', country: 'México' },
  
  // América Central
  'GTQ': { name: 'Quetzal Guatemalteco', symbol: 'Q', country: 'Guatemala' },
  'BZD': { name: 'Dólar Beliceño', symbol: 'BZ$', country: 'Belice' },
  'HNL': { name: 'Lempira Hondureña', symbol: 'L', country: 'Honduras' },
  'NIO': { name: 'Córdoba Nicaragüense', symbol: 'C$', country: 'Nicaragua' },
  'CRC': { name: 'Colón Costarricense', symbol: '₡', country: 'Costa Rica' },
  'PAB': { name: 'Balboa Panameña', symbol: 'B/.', country: 'Panamá' },
  
  // El Caribe
  'CUP': { name: 'Peso Cubano', symbol: '$', country: 'Cuba' },
  'DOP': { name: 'Peso Dominicano', symbol: 'RD$', country: 'República Dominicana' },
  'HTG': { name: 'Gourde Haitiano', symbol: 'G', country: 'Haití' },
  'JMD': { name: 'Dólar Jamaiquino', symbol: 'J$', country: 'Jamaica' },
  'TTD': { name: 'Dólar de Trinidad y Tobago', symbol: 'TT$', country: 'Trinidad y Tobago' },
  'BBD': { name: 'Dólar de Barbados', symbol: 'Bds$', country: 'Barbados' },
  'XCD': { name: 'Dólar del Caribe Oriental', symbol: 'EC$', country: 'Caribe Oriental' },
  
  // América del Sur
  'ARS': { name: 'Peso Argentino', symbol: '$', country: 'Argentina' },
  'BOB': { name: 'Boliviano', symbol: 'Bs.', country: 'Bolivia' },
  'BRL': { name: 'Real Brasileño', symbol: 'R$', country: 'Brasil' },
  'CLP': { name: 'Peso Chileno', symbol: '$', country: 'Chile' },
  'COP': { name: 'Peso Colombiano', symbol: '$', country: 'Colombia' },
  'GYD': { name: 'Dólar Guyanés', symbol: 'G$', country: 'Guyana' },
  'PYG': { name: 'Guaraní Paraguayo', symbol: '₲', country: 'Paraguay' },
  'PEN': { name: 'Sol Peruano', symbol: 'S/', country: 'Perú' },
  'SRD': { name: 'Dólar Surinamés', symbol: 'Sr$', country: 'Surinam' },
  'UYU': { name: 'Peso Uruguayo', symbol: '$U', country: 'Uruguay' },
  'VES': { name: 'Bolívar Soberano', symbol: 'Bs.S', country: 'Venezuela' }
};

// Función helper para obtener el símbolo de la moneda
export const getCurrencySymbol = (code) => {
  return currencies[code]?.symbol || code;
};

// Función helper para obtener el nombre completo de la moneda
export const getCurrencyName = (code) => {
  return currencies[code]?.name || code;
};

// Función helper para formatear precio con moneda
export const formatPrice = (amount, currencyCode) => {
  const currency = currencies[currencyCode];
  if (!currency) return `${amount} ${currencyCode}`;
  
  return `${currency.symbol}${amount}`;
};
