// src/data/bonosData.js
// Datos fijos de bonos argentinos (obtenidos de prospectos de emisión)

export const bonosData = {
  // AO27 - Bonar 2027
  'AO27': {
    valorNominal: 100,
    cupon: 6.0,
    frecuencia: 'mensual',
    moneda: 'USD',
    fechaEmision: '2026-02-25',
    observaciones: 'Emisión del gobierno para captar dólares del blanqueo'
  },
  
  // AL30 - Bonar 2030
  'AL30': {
    valorNominal: 1000,
    cupon: 0.75,
    frecuencia: 'semestral',
    moneda: 'ARS',
    fechaEmision: '2020-09-04',
    observaciones: 'Bono más líquido del mercado'
  },
  
  // GD30 - Global 2030
  'GD30': {
    valorNominal: 100,
    cupon: 1.0,
    frecuencia: 'semestral',
    moneda: 'USD',
    observaciones: 'Bono bajo ley internacional'
  },
  
  // AL35 - Bonar 2035
  'AL35': {
    valorNominal: 1000,
    cupon: 1.4,
    frecuencia: 'semestral',
    moneda: 'ARS',
    observaciones: 'Bono largo plazo'
  },
  
  // GD35 - Global 2035
  'GD35': {
    valorNominal: 100,
    cupon: 1.5,
    frecuencia: 'semestral',
    moneda: 'USD',
    observaciones: 'Bono ley internacional'
  },
  
  // AL41 - Bonar 2041
  'AL41': {
    valorNominal: 1000,
    cupon: 2.0,
    frecuencia: 'semestral',
    moneda: 'ARS',
    observaciones: 'Bono ultra largo'
  },
  
  // AN29 - Bonar 2029 (nuevo)
  'AN29': {
    valorNominal: 1000,
    cupon: 6.5,
    frecuencia: 'semestral',
    moneda: 'ARS',
    observaciones: 'Nueva emisión 2025'
  },
  
  // AE38
  'AE38': {
    valorNominal: 1000,
    cupon: 4.0,
    frecuencia: 'semestral',
    moneda: 'ARS',
    observaciones: 'Bono largo plazo'
  }
};

// Función para obtener datos de un bono (con fallback)
export const getBonoData = (ticker) => {
  return bonosData[ticker] || {
    valorNominal: 1000,
    cupon: null,
    frecuencia: 'semestral',
    moneda: 'ARS',
    observaciones: 'Datos no disponibles'
  };
};