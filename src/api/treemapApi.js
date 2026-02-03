// src/api/treemapApi.js - VERSIÓN ALPHA VANTAGE
import axios from 'axios';

const CACHE_DURATION = 300000; // 5 minutos (Alpha Vantage tiene rate limits)
let cache = {};

export const treemapApi = {
  /**
   * Obtiene datos del panel líder argentino
   */
  getLeaderPanel: async () => {
    const cacheKey = 'leaderPanel';
    const cacheTime = 300000; // 5 minutos para acciones argentinas
    
    // Verificar caché
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < cacheTime) {
      console.log('📦 Using cached leader data');
      return cache[cacheKey].data;
    }

    const symbols = ['GGAL', 'YPFD', 'PAMP', 'CEPU', 'BMA', 'LOMA', 'CRES', 'EDN'];
    
    try {
      console.log('🔄 Fetching leader data from Alpha Vantage...');
      const data = await fetchAlphaVantageBatch('leader', symbols);
      
      // Guardar en caché
      cache[cacheKey] = { data, timestamp: Date.now() };
      console.log(`✅ Leader data: ${data.filter(d => d.real).length} real, ${data.filter(d => !d.real).length} mock`);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching leader:', error.message);
      return getEnhancedMockLeaderPanel();
    }
  },

  /**
   * Obtiene datos de CEDEARs
   */
  getCedears: async () => {
    const cacheKey = 'cedears';
    const cacheTime = 300000; // 5 minutos para CEDEARs
    
    // Verificar caché
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < cacheTime) {
      console.log('📦 Using cached cedears data');
      return cache[cacheKey].data;
    }

    const symbols = ['SPY', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA'];
    
    try {
      console.log('🔄 Fetching cedears data from Alpha Vantage...');
      const data = await fetchAlphaVantageBatch('cedears', symbols);
      
      // Guardar en caché
      cache[cacheKey] = { data, timestamp: Date.now() };
      console.log(`✅ Cedears data: ${data.filter(d => d.real).length} real, ${data.filter(d => !d.real).length} mock`);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching cedears:', error.message);
      return getEnhancedMockCedears();
    }
  },

  clearCache: () => {
    console.log('🧹 Clearing Alpha Vantage cache');
    cache = {};
  }
};

// En la función fetchAlphaVantageBatch
async function fetchAlphaVantageBatch(type, symbols) {
  const baseUrl = window.location.origin;
  const symbolsParam = symbols.slice(0, 3).join(','); // Solo 3 símbolos
  const url = `${baseUrl}/api/alpha-vantage-proxy?symbols=${symbolsParam}`;
  
  console.log(`🌐 Calling Alpha Vantage proxy for ${type}: ${symbolsParam}`);
  
  try {
    const response = await axios.get(url, {
      timeout: 45000, // 45 segundos (3 símbolos * 15 segundos cada uno)
      validateStatus: () => true // Aceptar cualquier status
    });
    
    // Asegurarse de que siempre sea un array
    let data = response.data;
    
    if (!data || typeof data !== 'object') {
      console.warn('Invalid response format, using empty array');
      data = [];
    }
    
    if (!Array.isArray(data)) {
      console.warn('Response is not array, converting');
      data = [data];
    }
    
    console.log(`📊 Received ${data.length} items for ${type}`);
    return data;
    
  } catch (error) {
    console.error(`Alpha Vantage proxy failed for ${type}:`, error.message);
    return getEnhancedMockData(type, symbols.slice(0, 4));
  }
}

/**
 * Mock mejorado para leader panel
 */
function getEnhancedMockLeaderPanel() {
  console.log('🎭 Using enhanced mock leader data');
  const now = new Date();
  
  return [
    { 
      ticker: 'GGAL', 
      variation: (Math.random() * 6 - 3).toFixed(2), // -3% a +3%
      price: 1250 + Math.random() * 100,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'YPFD', 
      variation: (Math.random() * 4 - 2).toFixed(2), // -2% a +2%
      price: 8450 + Math.random() * 200,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'PAMP', 
      variation: (Math.random() * 5 - 2.5).toFixed(2),
      price: 2345 + Math.random() * 150,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'CEPU', 
      variation: (Math.random() * 8 - 4).toFixed(2),
      price: 856 + Math.random() * 50,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    }
  ];
}

/**
 * Mock mejorado para CEDEARs
 */
function getEnhancedMockCedears() {
  console.log('🎭 Using enhanced mock cedears data');
  const now = new Date();
  
  return [
    { 
      ticker: 'SPY', 
      variation: (Math.random() * 3 - 1.5).toFixed(2), // -1.5% a +1.5%
      price: 485 + Math.random() * 20,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'AAPL', 
      variation: (Math.random() * 4 - 2).toFixed(2),
      price: 182 + Math.random() * 10,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'MSFT', 
      variation: (Math.random() * 3 - 1.5).toFixed(2),
      price: 415 + Math.random() * 15,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    },
    { 
      ticker: 'GOOGL', 
      variation: (Math.random() * 3 - 1.5).toFixed(2),
      price: 142 + Math.random() * 8,
      source: 'enhanced-mock',
      real: false,
      updatedAt: now.toISOString()
    }
  ];
}

export default treemapApi;