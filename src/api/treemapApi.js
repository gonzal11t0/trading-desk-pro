// src/api/treemapApi.js - VERSIÓN CORRECTA Y LIMPIA
import axios from 'axios';

const FMP_API_KEY = import.meta.env.VITE_FMP_KEY || '0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA';
const CACHE_DURATION = 180000; // 3 minutos
let cache = {};

export const treemapApi = {
  /**
   * Obtiene datos del panel líder argentino usando FMP
   */
  getLeaderPanel: async () => {
    const cacheKey = 'leaderPanel';
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    const symbols = [
      'GGAL', 'YPFD', 'PAMP', 'CEPU', 
      'BMA', 'LOMA', 'CRES', 'EDN',
      'TXAR', 'MIRG'
    ];

    try {
      const data = await fetchFMPBatch(symbols, 'leader');
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('Error fetching leader panel:', error);
      return getMockLeaderPanel();
    }
  },

  /**
   * Obtiene datos de CEDEARs usando FMP
   */
  getCedears: async () => {
    const cacheKey = 'cedears';
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    const symbols = [
      'SPY', 'MSTR', 'NVDA', 'META', 
      'AAPL', 'GOOGL', 'MSFT', 'TSLA',
      'AMZN', 'MELI'
    ];

    try {
      const data = await fetchFMPBatch(symbols, 'cedears');
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('Error fetching cedears:', error);
      return getMockCedears();
    }
  },

  clearCache: () => {
    cache = {};
  },

  getCacheStatus: () => {
    return {
      leaderPanel: cache['leaderPanel'] ? 'cached' : 'empty',
      cedears: cache['cedears'] ? 'cached' : 'empty',
      timestamp: cache['leaderPanel']?.timestamp || null
    };
  }
};

/**
 * Obtener datos de FMP por lotes - ENDPOINT CORRECTO
 */
async function fetchFMPBatch(symbols, type) {
  try {
    const symbolsParam = symbols.slice(0, 10).join(',');
    
    // Verificar si estamos en desarrollo o producción
    if (import.meta.env.DEV) {
      // Desarrollo: llamar directo a FMP
      const endpoint = `https://financialmodelingprep.com/stable/quote/${symbolsParam}?apikey=${FMP_API_KEY}`;
      console.log(`📡 Dev: Fetching ${type} from FMP directly`);
      
      const response = await axios.get(endpoint, {
        timeout: 10000,
        headers: { 'apikey': FMP_API_KEY }
      });
      
      return transformFMPData(response.data);
      
    } else {
      // Producción (Vercel): usar nuestro proxy
      const endpoint = `${window.location.origin}/api/fmp-proxy?symbols=${symbolsParam}&type=quote`;
      console.log(`🌐 Prod: Fetching ${type} via proxy`);
      
      const response = await axios.get(endpoint, {
        timeout: 10000
      });
      
      return transformFMPData(response.data);
    }
    
  } catch (error) {
    console.error(`Error fetching ${type} batch:`, error.message);
    
    // Fallback a datos mock
    if (type === 'leader') {
      console.log('🔄 Falling back to mock leader data');
      return getMockLeaderPanel();
    } else {
      console.log('🔄 Falling back to mock cedears data');
      return getMockCedears();
    }
  }
}

// Función auxiliar para transformar datos
function transformFMPData(fmpData) {
  if (!fmpData || fmpData.length === 0) {
    throw new Error('No data returned from FMP');
  }
  
  return fmpData.map(item => ({
    ticker: item.symbol,
    variation: item.changePercent || 0,
    price: item.price || 0,
    previousClose: item.previousClose || item.price,
    marketCap: item.marketCap || 0,
    volume: item.volume || 0,
    dayHigh: item.dayHigh || item.price,
    dayLow: item.dayLow || item.price,
    updatedAt: new Date().toISOString(),
    source: 'fmp-realtime', // <-- Cambiado para identificar datos reales
    name: item.name || item.symbol
  }));
}

/**
 * Datos mock del panel líder
 */
function getMockLeaderPanel() {
  return [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50, marketCap: 1250000000000, source: 'mock' },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75, marketCap: 9800000000000, source: 'mock' },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25, marketCap: 4500000000000, source: 'mock' },
    { ticker: 'CEPU', variation: 4.77, price: 856.30, marketCap: 850000000000, source: 'mock' },
    { ticker: 'BMA', variation: 0.85, price: 3450.60, marketCap: 3200000000000, source: 'mock' },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80, marketCap: 1800000000000, source: 'mock' },
    { ticker: 'CRES', variation: 0.15, price: 890.40, marketCap: 950000000000, source: 'mock' },
    { ticker: 'EDN', variation: 1.75, price: 1230.20, marketCap: 750000000000, source: 'mock' },
    { ticker: 'TXAR', variation: -0.45, price: 3200.80, marketCap: 2900000000000, source: 'mock' },
    { ticker: 'MIRG', variation: 0.90, price: 1850.30, marketCap: 1200000000000, source: 'mock' }
  ];
}

/**
 * Datos mock de CEDEARs
 */
function getMockCedears() {
  return [
    { ticker: 'SPY', variation: 0.73, price: 485.25, marketCap: 450000000000000, source: 'mock' },
    { ticker: 'MSTR', variation: -8.14, price: 675.40, marketCap: 11500000000, source: 'mock' },
    { ticker: 'NVDA', variation: 0.45, price: 525.30, marketCap: 1320000000000, source: 'mock' },
    { ticker: 'META', variation: -0.75, price: 368.90, marketCap: 950000000000, source: 'mock' },
    { ticker: 'AAPL', variation: -1.63, price: 182.34, marketCap: 2850000000000, source: 'mock' },
    { ticker: 'GOOGL', variation: 0.25, price: 142.25, marketCap: 1780000000000, source: 'mock' },
    { ticker: 'MSFT', variation: 0.45, price: 415.62, marketCap: 3090000000000, source: 'mock' },
    { ticker: 'TSLA', variation: -4.03, price: 245.80, marketCap: 780000000000, source: 'mock' },
    { ticker: 'AMZN', variation: 1.25, price: 155.45, marketCap: 1600000000000, source: 'mock' },
    { ticker: 'MELI', variation: 2.15, price: 1780.50, marketCap: 89000000000, source: 'mock' }
  ];
}

/**
 * Función adicional para obtener todos los datos del treemap
 */
export const getAllTreemapData = async () => {
  try {
    const [leaderPanel, cedears] = await Promise.all([
      treemapApi.getLeaderPanel(),
      treemapApi.getCedears()
    ]);

    return {
      leaderPanel,
      cedears,
      totalItems: leaderPanel.length + cedears.length,
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      leaderPanel: getMockLeaderPanel(),
      cedears: getMockCedears(),
      totalItems: 20,
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }
};

/**
 * Datos mock para un símbolo específico (para compatibilidad)
 */
function getMockSymbolData(symbol) {
  const mockData = {
    'GGAL': { variation: 2.15, price: 1250.50, marketCap: 1250000000000 },
    'YPFD': { variation: -0.71, price: 8450.75, marketCap: 9800000000000 },
    'SPY': { variation: 0.73, price: 485.25, marketCap: 450000000000000 },
    'AAPL': { variation: -1.63, price: 182.34, marketCap: 2850000000000 }
  };

  const data = mockData[symbol] || { variation: 0, price: 100, marketCap: 1000000000 };
  
  return {
    ticker: symbol,
    ...data,
    previousClose: data.price * (1 - data.variation / 100),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    dayHigh: data.price * 1.02,
    dayLow: data.price * 0.98,
    updatedAt: new Date().toISOString(),
    source: 'mock'
  };
}

export default {
  ...treemapApi,
  getAllTreemapData,
  getMockLeaderPanel,
  getMockCedears,
  getMockSymbolData
};