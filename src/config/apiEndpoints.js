// src/config/apiEndpoints.js - NUEVO ARCHIVO
export const API_CONFIG = {
  // VERIFICAR QUÉ KEYS TENEMOS
  checkKeys: () => {
    return {
      hasAlphaVantage: !!import.meta.env.VITE_ALPHA_VANTAGE_KEY,
      hasFMP: !!import.meta.env.VITE_FMP_KEY,
      hasIEX: !!import.meta.env.VITE_IEX_KEY,
      hasNewsAPI: !!import.meta.env.VITE_NEWSAPI_KEY,
      hasScraperAPI: !!import.meta.env.VITE_SCRAPERAPI_KEY
    };
  },
  
  // OBTENER KEY CON FALLBACK A DEMO
  getKey: (service) => {
    const keys = {
      alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_KEY,
      fmp: import.meta.env.VITE_FMP_KEY,
      iex: import.meta.env.VITE_IEX_KEY,
      newsApi: import.meta.env.VITE_NEWSAPI_KEY,
      scraperApi: import.meta.env.VITE_SCRAPERAPI_KEY
    };
    
    // Si no hay key, retornar 'demo' para algunos servicios
    return keys[service] || (service === 'fmp' || service === 'iex' ? 'demo' : null);
  },
  
  // ¿ESTAMOS EN MODO DEMO?
  isDemoMode: () => {
    const keys = API_CONFIG.checkKeys();
    return !keys.hasAlphaVantage && !keys.hasFMP && !keys.hasIEX;
  }
};