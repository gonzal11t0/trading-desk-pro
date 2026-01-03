// src/config/apiEndpoints.js - VERSIÓN COMPLETA
export const API_CONFIG = {
  // Verificar modo demo
  isDemoMode: () => {
    const keys = ['VITE_ALPHA_VANTAGE_KEY', 'VITE_FMP_KEY', 'VITE_IEX_KEY'];
    return !keys.some(key => import.meta.env[key]);
  },
  
  // Obtener keys
  getKey: (service) => {
    return import.meta.env[`VITE_${service.toUpperCase()}_KEY`] || null;
  },
  
  // Configuración BCRA
  bcra: {
    baseUrl: 'https://api.bcra.gob.ar/estadisticas/v4.0',
    timeout: 15000
  },
  
  // Configuración original de apiConfig.js
  crypto: {
    primary: 'coingecko',
    fallbacks: ['coincap', 'cryptocompare']
  },
  stocks: {
    primary: 'yahoofinance', 
    fallbacks: ['alphavantage']
  },
  merval: {
    primary: 'byma',
    fallbacks: ['investing', 'yahoo']
  },
  commodities: {
    primary: 'metalpriceapi',
    fallbacks: ['oilpriceapi', 'investing']
  }
};