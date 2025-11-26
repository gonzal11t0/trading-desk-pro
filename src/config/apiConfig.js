// src/config/apiConfig.js
export const API_CONFIG = {
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

// API Keys (guardar en .env en producción)
export const API_KEYS = {
  ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_KEY,
  METAL_PRICE: import.meta.env.VITE_METAL_PRICE_KEY,
  OIL_PRICE: import.meta.env.VITE_OIL_PRICE_KEY
};