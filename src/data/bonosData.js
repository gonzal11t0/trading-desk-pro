// src/data/bonosData.js
export const bonosData = {
  'AL30': {
    nombre: 'Bonos Argentinos Ley Argentina 2030',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2030-12-31',
    riesgo: 'Medio',
    recomendacion: (precio) => {
      if (precio < 84000) return { texto: '🟢 COMPRAR', razon: 'Precio con descuento significativo' };
      if (precio <= 88000) return { texto: '🟡 MANTENER', razon: 'Precio dentro del rango normal' };
      return { texto: '🔴 EVITAR', razon: 'Precio con sobreprecio' };
    }
  },
  'AL35': {
    nombre: 'Bonos Argentinos Ley Argentina 2035',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2035-12-31',
    riesgo: 'Alto',
    recomendacion: (precio) => {
      if (precio < 100000) return { texto: '🟢 COMPRAR', razon: 'Plazo largo con descuento' };
      if (precio <= 108000) return { texto: '🟡 MANTENER', razon: 'Precio razonable para plazo largo' };
      return { texto: '🔴 EVITAR', razon: 'Sobreprecio para bono de largo plazo' };
    }
  },
  'GD30': {
    nombre: 'Bonos Globales 2030',
    moneda: 'USD',
    valorNominal: 1000,
    cupon: 8.25,
    frecuencia: 'semestral',
    vencimiento: '2030-12-31',
    riesgo: 'Medio',
    recomendacion: (precio) => {
      if (precio < 85) return { texto: '🟢 COMPRAR', razon: 'TIR atractiva (>10%)' };
      if (precio <= 95) return { texto: '🟡 MANTENER', razon: 'TIR moderada' };
      return { texto: '🔴 EVITAR', razon: 'TIR baja para bono en dólares' };
    }
  },
  'GD35': {
    nombre: 'Bonos Globales 2035',
    moneda: 'USD',
    valorNominal: 1000,
    cupon: 8.75,
    frecuencia: 'semestral',
    vencimiento: '2035-12-31',
    riesgo: 'Alto',
    recomendacion: (precio) => {
      if (precio < 80) return { texto: '🟢 COMPRAR', razon: 'TIR muy atractiva (>12%)' };
      if (precio <= 92) return { texto: '🟡 MANTENER', razon: 'TIR razonable para plazo largo' };
      return { texto: '🔴 EVITAR', razon: 'Riesgo alto con poco upside' };
    }
  },
  'AE38': {
    nombre: 'Bonos Argentinos Ley Argentina 2038',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2038-12-31',
    riesgo: 'Alto',
    recomendacion: (precio) => {
      if (precio < 95000) return { texto: '🟢 COMPRAR', razon: 'Plazo muy largo con descuento' };
      if (precio <= 105000) return { texto: '🟡 MANTENER', razon: 'Precio razonable' };
      return { texto: '🔴 EVITAR', razon: 'Plazo muy largo con sobreprecio' };
    }
  },
  'AL41': {
    nombre: 'Bonos Argentinos Ley Argentina 2041',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2041-12-31',
    riesgo: 'Muy Alto',
    recomendacion: (precio) => {
      if (precio < 90000) return { texto: '🟢 COMPRAR', razon: 'Descuento extremo para plazo muy largo' };
      if (precio <= 98000) return { texto: '🟡 MANTENER', razon: 'Riesgo alto, precio moderado' };
      return { texto: '🔴 EVITAR', razon: 'Riesgo excesivo para el precio' };
    }
  },
  'AN29': {
    nombre: 'Bonos Argentinos Ley Argentina 2029',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2029-12-31',
    riesgo: 'Bajo',
    recomendacion: (precio) => {
      if (precio < 125000) return { texto: '🟢 COMPRAR', razon: 'Corto plazo con buen precio' };
      if (precio <= 138000) return { texto: '🟡 MANTENER', razon: 'Precio aceptable para corto plazo' };
      return { texto: '🔴 EVITAR', razon: 'Sobreprecio para bono de corto plazo' };
    }
  },
  'AO27': {
    nombre: 'Bonos Argentinos Ley Argentina 2027',
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: '2027-12-31',
    riesgo: 'Bajo',
    recomendacion: (precio) => {
      if (precio < 140000) return { texto: '🟢 COMPRAR', razon: 'Muy corto plazo con buen precio' };
      if (precio <= 150000) return { texto: '🟡 MANTENER', razon: 'Precio razonable para corto plazo' };
      return { texto: '🔴 EVITAR', razon: 'Sobreprecio, buscar alternativa' };
    }
  }
};

export const getBonoData = (ticker) => {
  return bonosData[ticker] || {
    nombre: ticker,
    moneda: 'ARS',
    valorNominal: 1000,
    cupon: null,
    frecuencia: null,
    vencimiento: null,
    riesgo: 'Desconocido',
    recomendacion: () => ({ texto: '🟡 SIN DATOS', razon: 'No hay suficiente información' })
  };
};