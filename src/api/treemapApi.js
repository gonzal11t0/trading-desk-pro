// src/api/treemapApi.js - VERSIÓN LIMPIA SIN BONOS
import axios from 'axios';

const CACHE_DURATION = 60000;
let cache = {};

export const treemapApi = {
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

  // ⚠️ FUNCIÓN getArgentineBonds ELIMINADA
  // ⚠️ FUNCIÓN getAllTreemapData ELIMINADA
};

// Función para Yahoo Finance (sin cambios)
async function fetchYahooFinanceBatch(symbols) {
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const results = [];
    
    for (const symbol of symbols.slice(0, 10)) {
      try {
        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
        const response = await axios.get(proxyUrl + encodeURIComponent(targetUrl), {
          timeout: 8000
        });

        if (!response.data || !response.data.chart || !response.data.chart.result) {
          console.warn(`Respuesta inválida para ${symbol}`);
          continue;
        }

        const result = response.data.chart.result[0];
        const meta = result.meta;
        
        if (!meta || meta.regularMarketPrice === undefined) {
          console.warn(`Datos incompletos para ${symbol}`);
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
          updatedAt: new Date(meta.regularMarketTime * 1000).toISOString()
        });

        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.warn(`Error en ${symbol}:`, error.message);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error general en Yahoo Finance:', error);
    return [];
  }
}

// Funciones mock (sin bonos)
function getMockLeaderPanel() {
  return [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50 },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75 },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25 },
    { ticker: 'CEPU', variation: 4.77, price: 856.30 },
    { ticker: 'BMA', variation: 0.85, price: 3450.60 },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80 },
    { ticker: 'CRES', variation: 0.15, price: 890.40 },
    { ticker: 'EDN', variation: 1.75, price: 1230.20 }
  ];
}

function getMockCedears() {
  return [
    { ticker: 'SPY', variation: 0.73, price: 485.25 },
    { ticker: 'MSTR', variation: -8.14, price: 675.40 },
    { ticker: 'NVDA', variation: 0.45, price: 125.30 },
    { ticker: 'META', variation: -0.75, price: 345.60 },
    { ticker: 'AAPL', variation: -1.63, price: 198.75 },
    { ticker: 'GOOGL', variation: 0.25, price: 145.30 },
    { ticker: 'TSLA', variation: -4.03, price: 245.80 },
    { ticker: 'AMZN', variation: 1.25, price: 178.90 }
  ];
}
