// src/api/mervalApi.js 

/**
 * Obtiene datos del índice MERVAL desde múltiples fuentes
 * @returns {Promise<Object>} Datos del MERVAL formateados
 */
export const fetchMervalData = async () => {
  try {
    // Intentar API principal (BCRA)
    const bcraData = await fetchMervalFromBCRA();
    if (bcraData) return bcraData;
    
    // Fallback a Mercados Ámbito
    const ambitoData = await fetchMervalFromAmbito();
    if (ambitoData) return ambitoData;
    
    // Último recurso: datos mock
    return getMockMervalData();
    
  } catch {
    return getMockMervalData();
  }
};

/**
 * Obtiene datos MERVAL desde API BCRA
 */
const fetchMervalFromBCRA = async () => {
  try {
    const response = await fetch(
      'https://api.estadisticasbcra.com/api/merval',
      { timeout: 8000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    
    const latest = data[data.length - 1];
    
    // Calcular cambio si hay datos históricos suficientes
    let change = 0;
    let changePercent = 0;
    
    if (data.length >= 2) {
      const previous = data[data.length - 2];
      change = latest.v - previous.v;
      changePercent = (change / previous.v) * 100;
    }
    
    return {
      price: latest.v,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: 0,
      timestamp: latest.d,
      source: 'BCRA API',
      symbol: 'MERVAL',
      name: 'Índice MERVAL'
    };
  } catch {
    return null;
  }
};

/**
 * Obtiene datos MERVAL desde Mercados Ámbito (fallback)
 */
const fetchMervalFromAmbito = async () => {
  try {
    const response = await fetch(
      'https://mercados.ambito.com/merval/grafico/anual',
      { timeout: 8000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    
    const latest = data[data.length - 1];
    
    return {
      price: latest.cierre,
      change: latest.variacion || 0,
      changePercent: latest.variacionPorcentual || 0,
      volume: 0,
      timestamp: latest.fecha,
      source: 'Mercados Ámbito',
      symbol: 'MERVAL',
      name: 'Índice MERVAL'
    };
  } catch {
    return null;
  }
};

/**
 * Datos mock para cuando fallan todas las APIs
 */
const getMockMervalData = () => {
  const mockPrice = 1250450;
  const mockChange = 9845;
  const mockChangePercent = (mockChange / (mockPrice - mockChange)) * 100;
  
  return {
    price: mockPrice,
    change: mockChange,
    changePercent: parseFloat(mockChangePercent.toFixed(2)),
    volume: 24567890000,
    timestamp: new Date().toISOString(),
    source: 'Datos de demostración',
    symbol: 'MERVAL',
    name: 'Índice MERVAL',
    components: [
      { symbol: 'GGAL', weight: 8.2, price: 2500 },
      { symbol: 'YPFD', weight: 7.8, price: 8500 },
      { symbol: 'PAMP', weight: 6.5, price: 4200 },
      { symbol: 'TXAR', weight: 5.9, price: 3200 },
      { symbol: 'COME', weight: 5.3, price: 1800 }
    ]
  };
};

/**
 * Obtiene datos de acciones individuales del MERVAL
 * @returns {Promise<Array>} Lista de acciones principales
 */
export const fetchMervalStocks = async () => {
  try {
    // Esta sería la integración con API de acciones argentinas
    // Por ahora retornamos datos mock
    return getMockMervalStocks();
  } catch {
    return getMockMervalStocks();
  }
};

/**
 * Datos mock de acciones del MERVAL
 */
const getMockMervalStocks = () => [
  {
    symbol: 'GGAL',
    name: 'Grupo Financiero Galicia',
    price: 2500.50,
    change: 45.25,
    changePercent: 1.84,
    volume: 1250000,
    marketCap: 1250000000000
  },
  {
    symbol: 'YPFD',
    name: 'YPF',
    price: 8500.75,
    change: -125.50,
    changePercent: -1.45,
    volume: 850000,
    marketCap: 9800000000000
  },
  {
    symbol: 'PAMP',
    name: 'Pampa Energía',
    price: 4200.25,
    change: 85.75,
    changePercent: 2.08,
    volume: 620000,
    marketCap: 4500000000000
  },
  {
    symbol: 'TXAR',
    name: 'Ternium Argentina',
    price: 3200.80,
    change: -42.30,
    changePercent: -1.30,
    volume: 380000,
    marketCap: 3200000000000
  },
  {
    symbol: 'COME',
    name: 'Comercial del Plata',
    price: 1800.40,
    change: 32.10,
    changePercent: 1.81,
    volume: 210000,
    marketCap: 1500000000000
  },
  {
    symbol: 'BBAR',
    name: 'Banco Francés',
    price: 950.25,
    change: 15.75,
    changePercent: 1.68,
    volume: 950000,
    marketCap: 850000000000
  },
  {
    symbol: 'VALO',
    name: 'Banco de Valores',
    price: 420.50,
    change: 8.25,
    changePercent: 2.00,
    volume: 1200000,
    marketCap: 380000000000
  }
];

/**
 * Obtiene datos históricos del MERVAL
 * @param {string} period - Período: '1d', '1w', '1m', '3m', '1y'
 * @returns {Promise<Array>} Datos históricos
 */
export const fetchMervalHistory = async (period = '1m') => {
  try {
    // Esta sería la integración con API histórica
    // Por ahora retornamos datos mock
    return generateMockHistory(period);
  } catch {
    return generateMockHistory(period);
  }
};

/**
 * Genera datos históricos mock según período
 */
const generateMockHistory = (period) => {
  const basePrice = 1250450;
  const dataPoints = {
    '1d': 24,   // 24 horas
    '1w': 7,    // 7 días
    '1m': 30,   // 30 días
    '3m': 90,   // 90 días
    '1y': 365   // 365 días
  };
  
  const points = dataPoints[period] || 30;
  const history = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Variación aleatoria realista
    const variation = (Math.random() - 0.5) * 0.04; // ±2%
    const price = basePrice * (1 + (i * 0.001) + variation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000
    });
  }
  
  return history;
};

export default {
  fetchMervalData,
  fetchMervalStocks,
  fetchMervalHistory
};