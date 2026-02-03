// src/api/treemapApi.js - VERSIÓN CON DATOS REALES
import axios from 'axios';

const CACHE_DURATION = 120000; // 2 minutos cache local
let cache = {};

export const treemapApi = {
  /**
   * Obtiene datos del panel líder argentino CON DATOS REALES
   */
  getLeaderPanel: async () => {
    const cacheKey = 'leaderPanel';
    
    // Cache local (breve)
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      console.log('📦 Using local cached leader data');
      return cache[cacheKey].data;
    }

    try {
      console.log('🔄 Fetching REAL leader data from Alpha Vantage...');
      const data = await fetchFromAlphaVantageProxy('leader');
      
      // Actualizar cache local
      cache[cacheKey] = { 
        data, 
        timestamp: Date.now(),
        source: data[0]?.source || 'unknown'
      };
      
      const realCount = data.filter(item => item.real).length;
      console.log(`✅ Leader: ${realCount} real, ${data.length - realCount} mock`);
      
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching leader data:', error.message);
      return getEnhancedMockData('leader');
    }
  },

  /**
   * Obtiene datos de CEDEARs CON DATOS REALES
   */
  getCedears: async () => {
    const cacheKey = 'cedears';
    
    // Cache local (breve)
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      console.log('📦 Using local cached cedears data');
      return cache[cacheKey].data;
    }

    try {
      console.log('🔄 Fetching REAL cedears data from Alpha Vantage...');
      const data = await fetchFromAlphaVantageProxy('cedears');
      
      // Actualizar cache local
      cache[cacheKey] = { 
        data, 
        timestamp: Date.now(),
        source: data[0]?.source || 'unknown'
      };
      
      const realCount = data.filter(item => item.real).length;
      console.log(`✅ Cedears: ${realCount} real, ${data.length - realCount} mock`);
      
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching cedears data:', error.message);
      return getEnhancedMockData('cedears');
    }
  },

  clearCache: () => {
    console.log('🧹 Clearing all cache');
    cache = {};
    if (global.alphaVantageCache) {
      global.alphaVantageCache = {};
    }
  },

  getCacheStatus: () => ({
    leaderPanel: cache['leaderPanel'] ? 'cached' : 'empty',
    cedears: cache['cedears'] ? 'cached' : 'empty',
    leaderSource: cache['leaderPanel']?.source || 'none',
    cedearsSource: cache['cedears']?.source || 'none'
  })
};

/**
 * Llamar al proxy de Alpha Vantage
 */
async function fetchFromAlphaVantageProxy(type) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/alpha-vantage-enhanced?type=${type}&cache=true`;
  
  console.log(`🌐 Calling Alpha Vantage proxy: ${url}`);
  
  try {
    const response = await axios.get(url, {
      timeout: 30000, // 30 segundos (Alpha Vantage puede ser lento)
      validateStatus: (status) => status < 500
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid response from proxy, using mock');
      throw new Error('Invalid response format');
    }
    
    return response.data;
    
  } catch (error) {
    console.error('Proxy call failed:', error.message);
    throw error;
  }
}

/**
 * Datos mock mejorados (solo para fallback extremo)
 */
function getEnhancedMockData(type) {
  console.log(`🎭 Using enhanced mock data for ${type}`);
  
  const now = new Date();
  const baseData = type === 'leader' ? [
    { ticker: 'GGAL', basePrice: 1250, volatility: 3 },
    { ticker: 'YPFD', basePrice: 8450, volatility: 2 },
    { ticker: 'PAMP', basePrice: 2345, volatility: 2.5 },
    { ticker: 'CEPU', basePrice: 856, volatility: 4 },
    { ticker: 'BMA', basePrice: 3450, volatility: 1.5 },
    { ticker: 'EDN', basePrice: 1230, volatility: 2 }
  ] : [
    { ticker: 'SPY', basePrice: 485, volatility: 1.5 },
    { ticker: 'AAPL', basePrice: 182, volatility: 2 },
    { ticker: 'MSFT', basePrice: 415, volatility: 1.5 },
    { ticker: 'GOOGL', basePrice: 142, volatility: 1.5 },
    { ticker: 'AMZN', basePrice: 155, volatility: 2 },
    { ticker: 'META', basePrice: 368, volatility: 2 }
  ];
  
  return baseData.map(item => {
    // Variación aleatoria realista
    const variation = (Math.random() * (item.volatility * 2) - item.volatility).toFixed(2);
    const price = item.basePrice * (1 + parseFloat(variation) / 100);
    
    return {
      ticker: item.ticker,
      variation: parseFloat(variation),
      price: parseFloat(price.toFixed(2)),
      previousClose: item.basePrice,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      marketCap: item.basePrice * 10000000,
      updatedAt: now.toISOString(),
      source: 'enhanced-mock',
      real: false
    };
  });
}

export default treemapApi;