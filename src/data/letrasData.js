// src/data/letrasData.js
// Datos fijos de letras argentinas (según instrumento)

export const letrasData = {
  // Letras Capitalización
  'S27F6': {
    nombre: 'LETRA S27F6',
    tipo: 'Capitalización',
    tna: 38.0,
    tea: 42.3,
    plazo: 30,
    moneda: 'ARS',
    observaciones: 'Letra corto plazo'
  },
  'S29Y6': {
    nombre: 'LETRA S29Y6',
    tipo: 'Capitalización',
    tna: 42.0,
    tea: 47.8,
    plazo: 90,
    moneda: 'ARS',
    observaciones: 'Tasa alta, plazo intermedio'
  },
  'S30N6': {
    nombre: 'LETRA S30N6',
    tipo: 'Capitalización',
    tna: 40.0,
    tea: 45.1,
    plazo: 270,
    moneda: 'ARS',
    observaciones: 'Largo plazo'
  },
  
  // Letras CER
  'X29Y6': {
    nombre: 'LETRA X29Y6 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 22.0,
    tea: 24.5,
    plazo: 90,
    moneda: 'ARS',
    observaciones: 'Cobertura inflacionaria'
  },
  'X30N6': {
    nombre: 'LETRA X30N6 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 22.0,
    tea: 24.5,
    plazo: 270,
    moneda: 'ARS',
    observaciones: 'CER largo plazo'
  },
  
  // Bonos CER
  'TZX27': {
    nombre: 'BONO TZX27 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 24.0,
    tea: 26.8,
    plazo: 480,
    moneda: 'ARS',
    observaciones: 'Bono CER 2027'
  },
  'TZX28': {
    nombre: 'BONO TZX28 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 24.0,
    tea: 26.8,
    plazo: 840,
    moneda: 'ARS',
    observaciones: 'Bono CER 2028'
  },
  
  // TAMAR
  'M31G6': {
    nombre: 'M31G6 (TAMAR)',
    tipo: 'Capitalización',
    tna: 36.0,
    tea: 40.2,
    plazo: 180,
    moneda: 'ARS',
    observaciones: 'Tasa intermedia'
  },
  
  // Dólar-linked
  'D27F6': {
    nombre: 'D27F6 (Dólar-linked)',
    tipo: 'Dólar-linked',
    tna: 32.0,
    tea: 35.5,
    plazo: 30,
    moneda: 'USD',
    observaciones: 'Protección cambiaria'
  },
  
  // Bonar USD
  'AO27': {
    nombre: 'AO27 (Bonar USD)',
    tipo: 'Dólar-linked',
    tna: 28.0,
    tea: 31.2,
    plazo: 600,
    moneda: 'USD',
    observaciones: 'Dólar-linked largo plazo'
  },
    'S16M6': {
    nombre: 'LETRA S16M6',
    tipo: 'Capitalización',
    tna: null,      // Si no tenés el dato, dejalo null
    tea: null,
    plazo: null,
    moneda: 'ARS',
    observaciones: 'Letra corto plazo'
  },
  'S17A6': {
    nombre: 'LETRA S17A6',
    tipo: 'Capitalización',
    tna: null,
    tea: null,
    plazo: null,
    moneda: 'ARS'
  },
  'LBA26': {
    nombre: 'LBA26',
    tipo: 'Capitalización',
    tna: null,
    tea: null,
    plazo: null,
    moneda: 'ARS'
  },
  'LBM26': {
    nombre: 'LBM26',
    tipo: 'Capitalización',
    tna: null,
    tea: null,
    plazo: null,
    moneda: 'ARS'
  }
};

export const getLetraData = (ticker) => {
  return letrasData[ticker] || {
    nombre: ticker,
    tipo: 'Capitalización',
    tna: null,
    tea: null,
    plazo: null,
    moneda: 'ARS',
    observaciones: 'Datos no disponibles'
  };
};