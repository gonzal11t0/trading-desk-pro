// src/api/stocksApi.js 
import { isDemoMode, getDemoData } from '../utils/demoMode';

/**
 * Obtiene el precio de una acción desde múltiples fuentes
 * @param {string} symbol - Símbolo de la acción (AAPL, MSFT, etc.)
 * @returns {Promise<{price: number, change: number, changePercent: number}>}
 */
export const fetchStockPrice = async (symbol) => {
  // Modo demo (si está configurado)
  if (isDemoMode()) {
    const demoData = getDemoData('stocks');
    return demoData[symbol] || { 
      price: 100, 
      change: 0, 
      changePercent: 0,
      source: 'demo'
    };
  }
  
  try {
    // Intentar FMP primero
    const fmpData = await fetchFromFMP(symbol);
    if (fmpData) return fmpData;
    
    // Fallback a IEX Cloud
    const iexData = await fetchFromIEX(symbol);
    if (iexData) return iexData;
    
    // Último recurso: datos mock
    return getMockStockData(symbol);
    
  } catch {
    return getMockStockData(symbol);
  }
};

/**
 * Obtiene datos de Financial Modeling Prep
 */
const fetchFromFMP = async (symbol) => {
  try {
    const API_KEY = import.meta.env.VITE_FMP_KEY || 'demo';
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`,
      { timeout: 8000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    
    const stock = data[0];
    return {
      price: stock.price,
      change: stock.change,
      changePercent: stock.changesPercentage,
      source: 'Financial Modeling Prep',
      symbol,
      name: stock.name || symbol,
      volume: stock.volume || 0,
      marketCap: stock.marketCap || 0
    };
  } catch {
    return null;
  }
};

/**
 * Obtiene datos de IEX Cloud (fallback)
 */
const fetchFromIEX = async (symbol) => {
  try {
    const API_KEY = import.meta.env.VITE_IEX_KEY || 'demo';
    const response = await fetch(
      `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${API_KEY}`,
      { timeout: 8000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      price: data.latestPrice,
      change: data.change,
      changePercent: data.changePercent * 100,
      source: 'IEX Cloud',
      symbol,
      name: data.companyName || symbol,
      volume: data.volume || 0,
      marketCap: data.marketCap || 0
    };
  } catch {
    return null;
  }
};

/**
 * Datos mock para cuando fallan las APIs
 */
const getMockStockData = (symbol) => {
  const mockDatabase = {
    AAPL: { 
      price: 182.34, 
      change: 1.45, 
      changePercent: 0.80,
      name: 'Apple Inc.',
      volume: 55000000,
      marketCap: 2850000000000
    },
    MSFT: { 
      price: 415.62, 
      change: -2.15, 
      changePercent: -0.51,
      name: 'Microsoft Corporation',
      volume: 25000000,
      marketCap: 3090000000000
    },
    TSLA: { 
      price: 245.80, 
      change: 5.25, 
      changePercent: 2.18,
      name: 'Tesla Inc.',
      volume: 95000000,
      marketCap: 780000000000
    },
    GOOGL: { 
      price: 142.25, 
      change: 0.85, 
      changePercent: 0.60,
      name: 'Alphabet Inc.',
      volume: 18000000,
      marketCap: 1780000000000
    },
    AMZN: { 
      price: 155.45, 
      change: 1.25, 
      changePercent: 0.81,
      name: 'Amazon.com Inc.',
      volume: 35000000,
      marketCap: 1600000000000
    },
    META: { 
      price: 368.90, 
      change: 3.45, 
      changePercent: 0.94,
      name: 'Meta Platforms Inc.',
      volume: 22000000,
      marketCap: 950000000000
    },
    NVDA: { 
      price: 525.30, 
      change: 12.45, 
      changePercent: 2.43,
      name: 'NVIDIA Corporation',
      volume: 45000000,
      marketCap: 1320000000000
    },
    NFLX: { 
      price: 485.15, 
      change: -3.20, 
      changePercent: -0.65,
      name: 'Netflix Inc.',
      volume: 8500000,
      marketCap: 215000000000
    }
  };
  
  const defaultData = {
    price: 100,
    change: 0,
    changePercent: 0,
    name: symbol,
    volume: 0,
    marketCap: 0
  };
  
  return { 
    ...(mockDatabase[symbol] || defaultData),
    source: 'Datos de demostración',
    symbol
  };
};

/**
 * Obtiene múltiples acciones a la vez
 */
export const fetchMultipleStocks = async (symbols) => {
  try {
    const promises = symbols.map(symbol => fetchStockPrice(symbol));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
      symbol: symbols[index],
      ...(result.status === 'fulfilled' ? result.value : getMockStockData(symbols[index]))
    }));
  } catch {
    return symbols.map(symbol => ({
      symbol,
      ...getMockStockData(symbol)
    }));
  }
};

/**
 * Obtiene datos del S&P 500
 */
export const fetchSP500 = async () => {
  try {
    // Usar índice ^GSPC
    const sp500Data = await fetchFromFMP('^GSPC');
    if (sp500Data) return sp500Data;
    
    // Fallback específico para S&P 500
    return {
      price: 4567.89,
      change: 15.52,
      changePercent: 0.34,
      source: 'Datos de referencia',
      symbol: '^GSPC',
      name: 'S&P 500 Index',
      volume: 0,
      marketCap: 0
    };
  } catch {
    return getMockStockData('^GSPC');
  }
};

/**
 * Obtiene acciones populares para dashboard
 */
export const fetchPopularStocks = async () => {
  const popularSymbols = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN', 'META', 'NVDA'];
  return fetchMultipleStocks(popularSymbols);
};

export default {
  fetchStockPrice,
  fetchMultipleStocks,
  fetchSP500,
  fetchPopularStocks
};