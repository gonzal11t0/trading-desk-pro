// src/api/treemapApi.js 

import axios from 'axios';

const CACHE_DURATION = 180000; // 3 minutos
let cache = {};

// Configuración dinámica de proxy - CORREGIDO
const getProxyConfig = (symbol, isDevelopment) => {
  if (isDevelopment) {
    // En desarrollo, usar corsproxy.io
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
    return {
      url: proxyUrl + encodeURIComponent(targetUrl),
      requiresProcessing: false
    };
  } else {
    // En producción, usar nuestro propio proxy
    return {
      url: `${window.location.origin}/api/yahoo-proxy?symbol=${symbol}`,
      requiresProcessing: false
    };
  }
};

export const treemapApi = {
  /**
   * Obtiene datos del panel líder argentino
   */
  getLeaderPanel: async () => {
    const cacheKey = 'leaderPanel';
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    const symbols = [
      'GGAL.BA', 'YPFD.BA', 'PAMP.BA', 'CEPU.BA', 
      'BMA.BA', 'LOMA.BA', 'CRES.BA', 'EDN.BA',
      'TXAR.BA', 'MIRG.BA'
    ];

    try {
      const data = await fetchYahooFinanceBatch(symbols);
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('Error fetching leader panel:', error);
      return getMockLeaderPanel();
    }
  },

  /**
   * Obtiene datos de CEDEARs
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
      const data = await fetchYahooFinanceBatch(symbols);
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('Error fetching cedears:', error);
      return getMockCedears();
    }
  },

  /**
   * Limpiar caché
   */
  clearCache: () => {
    cache = {};
  },

  /**
   * Obtener estado del caché
   */
  getCacheStatus: () => {
    return {
      leaderPanel: cache['leaderPanel'] ? 'cached' : 'empty',
      cedears: cache['cedears'] ? 'cached' : 'empty',
      timestamp: cache['leaderPanel']?.timestamp || null
    };
  }
};

/**
 * Obtener datos de Yahoo Finance por lotes
 */
async function fetchYahooFinanceBatch(symbols) {
  const isDevelopment = import.meta.env.DEV;
  const results = [];
  
  // Limitar a 5 símbolos simultáneos para evitar rate limiting
  const batchSize = 5;
  const batches = [];
  
  for (let i = 0; i < symbols.length; i += batchSize) {
    batches.push(symbols.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    const promises = batch.map(symbol => fetchSingleSymbol(symbol, isDevelopment));
    const batchResults = await Promise.allSettled(promises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    }
    
    // Pequeña pausa entre batches
    if (!isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results.filter(item => item !== null);
}

/**
 * Obtener un solo símbolo - CORREGIDO
 */
async function fetchSingleSymbol(symbol, isDevelopment) {
  try {
    const proxyConfig = getProxyConfig(symbol, isDevelopment);
    
    const response = await axios.get(proxyConfig.url, {
      timeout: 8000,
      headers: isDevelopment ? {} : {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // Procesar respuesta según el proxy usado
    let data;
    if (proxyConfig.requiresProcessing && response.data?.contents) {
      data = JSON.parse(response.data.contents);
    } else {
      data = response.data;
    }

    if (!data?.chart?.result) {
      console.warn(`No data for ${symbol}`);
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    
    if (!meta || meta.regularMarketPrice === undefined) {
      return null;
    }
    
    const cleanTicker = symbol.replace('.BA', '');
    const previousClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
    const currentPrice = meta.regularMarketPrice;
    const changePercent = previousClose ? 
      ((currentPrice - previousClose) / previousClose) * 100 : 0;

    return {
      ticker: cleanTicker,
      variation: parseFloat(changePercent.toFixed(2)),
      price: currentPrice,
      previousClose: previousClose,
      marketCap: meta.marketCap || 0,
      volume: meta.regularMarketVolume || 0,
      updatedAt: new Date(meta.regularMarketTime * 1000).toISOString(),
      exchange: symbol.includes('.BA') ? 'BYMA' : 'NYSE/NASDAQ',
      source: 'yahoo'
    };
    
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
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
 * Función para obtener datos de un símbolo específico
 */
export const getSymbolData = async (symbol) => {
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
    
    const response = await axios.get(proxyUrl + encodeURIComponent(targetUrl), {
      timeout: 8000
    });

    if (!response.data?.chart?.result?.[0]?.meta) {
      return getMockSymbolData(symbol);
    }

    const meta = response.data.chart.result[0].meta;
    const previousClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
    const changePercent = ((meta.regularMarketPrice - previousClose) / previousClose) * 100;

    return {
      ticker: symbol.replace('.BA', ''),
      variation: parseFloat(changePercent.toFixed(2)),
      price: meta.regularMarketPrice,
      previousClose,
      marketCap: meta.marketCap || 0,
      volume: meta.regularMarketVolume || 0,
      dayHigh: meta.dayHigh || meta.regularMarketPrice,
      dayLow: meta.dayLow || meta.regularMarketPrice,
      updatedAt: new Date(meta.regularMarketTime * 1000).toISOString(),
      source: 'yahoo'
    };
  } catch {
    return getMockSymbolData(symbol);
  }
};

/**
 * Datos mock para un símbolo específico
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
  getSymbolData,
  fetchSingleSymbol,
  getMockLeaderPanel,
  getMockCedears
};