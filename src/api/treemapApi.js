// src/api/treemapApi.js - VERSIÓN SUPER SEGURA
export const treemapApi = {
  getLeaderPanel: async () => {
    console.log('📊 Loading leader panel (mock)');
    return getSafeMockLeaderPanel();
  },

  getCedears: async () => {
    console.log('📊 Loading cedears (mock)');
    return getSafeMockCedears();
  },

  clearCache: () => console.log('Cache cleared'),
  getCacheStatus: () => ({ leaderPanel: 'mock', cedears: 'mock' })
};

// Datos mock SEGUROS (con todas las propiedades requeridas)
function getSafeMockLeaderPanel() {
  return [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50, marketCap: 1250000000000, source: 'mock', real: false },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75, marketCap: 9800000000000, source: 'mock', real: false },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25, marketCap: 4500000000000, source: 'mock', real: false },
    { ticker: 'CEPU', variation: 4.77, price: 856.30, marketCap: 850000000000, source: 'mock', real: false },
    { ticker: 'BMA', variation: 0.85, price: 3450.60, marketCap: 3200000000000, source: 'mock', real: false },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80, marketCap: 1800000000000, source: 'mock', real: false },
    { ticker: 'CRES', variation: 0.15, price: 890.40, marketCap: 950000000000, source: 'mock', real: false },
    { ticker: 'EDN', variation: 1.75, price: 1230.20, marketCap: 750000000000, source: 'mock', real: false }
  ].map(item => ({
    ...item,
    id: item.ticker,
    previousClose: item.price * (1 - item.variation / 100),
    volume: Math.floor(Math.random() * 1000000) + 100000,
    updatedAt: new Date().toISOString()
  }));
}

function getSafeMockCedears() {
  return [
    { ticker: 'SPY', variation: 0.73, price: 485.25, marketCap: 450000000000000, source: 'mock', real: false },
    { ticker: 'AAPL', variation: -1.63, price: 182.34, marketCap: 2850000000000, source: 'mock', real: false },
    { ticker: 'MSFT', variation: 0.45, price: 415.62, marketCap: 3090000000000, source: 'mock', real: false },
    { ticker: 'GOOGL', variation: 0.25, price: 142.25, marketCap: 1780000000000, source: 'mock', real: false },
    { ticker: 'AMZN', variation: 1.25, price: 155.45, marketCap: 1600000000000, source: 'mock', real: false },
    { ticker: 'META', variation: -0.75, price: 368.90, marketCap: 950000000000, source: 'mock', real: false },
    { ticker: 'TSLA', variation: -4.03, price: 245.80, marketCap: 780000000000, source: 'mock', real: false },
    { ticker: 'NVDA', variation: 0.45, price: 525.30, marketCap: 1320000000000, source: 'mock', real: false }
  ].map(item => ({
    ...item,
    id: item.ticker,
    previousClose: item.price * (1 - item.variation / 100),
    volume: Math.floor(Math.random() * 1000000) + 100000,
    updatedAt: new Date().toISOString()
  }));
}

export default treemapApi;