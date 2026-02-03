// src/api/treemapApi.js 

import axios from 'axios';

const CACHE_DURATION = 60000; // 1 minuto
let cache = {};

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
    } catch {
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
    } catch {
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
  const proxyUrl = 'https://corsproxy.io/?';
  const results = [];
  
  for (const symbol of symbols.slice(0, 10)) {
    try {
      const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
      const response = await axios.get(proxyUrl + encodeURIComponent(targetUrl), {
        timeout: 8000
      });

      if (!response.data?.chart?.result) {
        continue;
      }

      const result = response.data.chart.result[0];
      const meta = result.meta;
      
      if (!meta || meta.regularMarketPrice === undefined) {
        continue;
      }
      
      const cleanTicker = symbol.replace('.BA', '');
      const previousClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
      const currentPrice = meta.regularMarketPrice;
      const changePercent = previousClose ? 
        ((currentPrice - previousClose) / previousClose) * 100 : 0;

      results.push({
        ticker: cleanTicker,
        variation: parseFloat(changePercent.toFixed(2)),
        price: currentPrice,
        previousClose: previousClose,
        marketCap: meta.marketCap || 0,
        volume: meta.regularMarketVolume || 0,
        updatedAt: new Date(meta.regularMarketTime * 1000).toISOString(),
        exchange: symbol.includes('.BA') ? 'BYMA' : 'NYSE/NASDAQ'
      });

      // Delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch {
      // Continuar con siguiente símbolo
    }
  }
  
  return results;
}

/**
 * Datos mock del panel líder
 */
function getMockLeaderPanel() {
  return [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50, marketCap: 1250000000000 },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75, marketCap: 9800000000000 },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25, marketCap: 4500000000000 },
    { ticker: 'CEPU', variation: 4.77, price: 856.30, marketCap: 850000000000 },
    { ticker: 'BMA', variation: 0.85, price: 3450.60, marketCap: 3200000000000 },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80, marketCap: 1800000000000 },
    { ticker: 'CRES', variation: 0.15, price: 890.40, marketCap: 950000000000 },
    { ticker: 'EDN', variation: 1.75, price: 1230.20, marketCap: 750000000000 },
    { ticker: 'TXAR', variation: -0.45, price: 3200.80, marketCap: 2900000000000 },
    { ticker: 'MIRG', variation: 0.90, price: 1850.30, marketCap: 1200000000000 }
  ];
}

/**
 * Datos mock de CEDEARs
 */
function getMockCedears() {
  return [
    { ticker: 'SPY', variation: 0.73, price: 485.25, marketCap: 450000000000000 },
    { ticker: 'MSTR', variation: -8.14, price: 675.40, marketCap: 11500000000 },
    { ticker: 'NVDA', variation: 0.45, price: 525.30, marketCap: 1320000000000 },
    { ticker: 'META', variation: -0.75, price: 368.90, marketCap: 950000000000 },
    { ticker: 'AAPL', variation: -1.63, price: 182.34, marketCap: 2850000000000 },
    { ticker: 'GOOGL', variation: 0.25, price: 142.25, marketCap: 1780000000000 },
    { ticker: 'MSFT', variation: 0.45, price: 415.62, marketCap: 3090000000000 },
    { ticker: 'TSLA', variation: -4.03, price: 245.80, marketCap: 780000000000 },
    { ticker: 'AMZN', variation: 1.25, price: 155.45, marketCap: 1600000000000 },
    { ticker: 'MELI', variation: 2.15, price: 1780.50, marketCap: 89000000000 }
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
  clearCache: treemapApi.clearCache,
  getCacheStatus: treemapApi.getCacheStatus
};