// src/data/letrasData.js
export const letrasData = {
  // Capitalización
  'S27F6': {
    nombre: 'LETRA S27F6',
    tipo: 'Capitalización',
    tna: 38.0,
    tea: 42.3,
    plazo: 30,
    moneda: 'ARS'
  },
  'S29Y6': {
    nombre: 'LETRA S29Y6',
    tipo: 'Capitalización',
    tna: 42.0,
    tea: 47.8,
    plazo: 90,
    moneda: 'ARS'
  },
  'S30N6': {
    nombre: 'LETRA S30N6',
    tipo: 'Capitalización',
    tna: 40.0,
    tea: 45.1,
    plazo: 270,
    moneda: 'ARS'
  },
  'M31G6': {
    nombre: 'M31G6 (TAMAR)',
    tipo: 'Capitalización',
    tna: 36.0,
    tea: 40.2,
    plazo: 180,
    moneda: 'ARS'
  },
  
  // CER
  'X29Y6': {
    nombre: 'LETRA X29Y6 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 22.0,
    tea: 24.5,
    plazo: 90,
    moneda: 'ARS'
  },
  'X30N6': {
    nombre: 'LETRA X30N6 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 22.0,
    tea: 24.5,
    plazo: 270,
    moneda: 'ARS'
  },
  
  // Bonos CER
  'TZX27': {
    nombre: 'BONO TZX27 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 24.0,
    tea: 26.8,
    plazo: 480,
    moneda: 'ARS'
  },
  'TZX28': {
    nombre: 'BONO TZX28 (CER)',
    tipo: 'Ajustable por inflación',
    tna: 24.0,
    tea: 26.8,
    plazo: 840,
    moneda: 'ARS'
  },
  
  // Dólar-linked
  'D27F6': {
    nombre: 'D27F6 (Dólar-linked)',
    tipo: 'Dólar-linked',
    tna: 32.0,
    tea: 35.5,
    plazo: 30,
    moneda: 'USD'
  },
  'AO27': {
    nombre: 'AO27 (Bonar USD)',
    tipo: 'Dólar-linked',
    tna: 28.0,
    tea: 31.2,
    plazo: 600,
    moneda: 'USD'
  }
};

export const getLetraData = (ticker, marketData = {}) => {
  // Buscar si el ticker contiene alguna de las claves
  for (const [key, data] of Object.entries(letrasData)) {
    if (ticker.includes(key)) {
      return {
        ...data,
        tna: Number.isFinite(Number(marketData.tna)) ? Number(marketData.tna) : null,
        tea: Number.isFinite(Number(marketData.tea)) ? Number(marketData.tea) : null,
        plazo: Number.isFinite(Number(marketData.plazo)) ? Number(marketData.plazo) : null,
        vencimiento: marketData.vencimiento || null
      };
    }
  }
  
  // Si no encuentra, devolver datos genéricos
  return {
    nombre: ticker,
    tipo: marketData.tipo || 'Instrumento del Tesoro',
    tna: Number.isFinite(Number(marketData.tna)) ? Number(marketData.tna) : null,
    tea: Number.isFinite(Number(marketData.tea)) ? Number(marketData.tea) : null,
    plazo: Number.isFinite(Number(marketData.plazo)) ? Number(marketData.plazo) : null,
    vencimiento: marketData.vencimiento || null,
    moneda: marketData.moneda || 'ARS'
  };
};
