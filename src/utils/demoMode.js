// src/utils/demoMode.js
export const isDemoMode = () => {
  const keys = [
    'VITE_ALPHA_VANTAGE_KEY',
    'VITE_FMP_KEY', 
    'VITE_IEX_KEY'
  ];
  
  return !keys.some(key => import.meta.env[key]);
};

export const getDemoData = (service) => {
  const demos = {
    stocks: {
      'AAPL': { price: 185.64, change: 2.34, changePercent: 1.28 },
      'MSFT': { price: 415.62, change: -2.15, changePercent: -0.51 },
      'TSLA': { price: 248.48, change: 5.67, changePercent: 2.34 }
    },
    news: [
      {
        title: 'Mercados Demo - Configura API Keys',
        source: 'Trading Desk Pro',
        time_published: new Date().toISOString(),
        summary: 'Para datos reales, añade tus API keys en .env'
      }
    ]
  };
  
  return demos[service];
};