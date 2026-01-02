// src/api/stocksApi.js
import { isDemoMode, getDemoData } from '../utils/demoMode';

export const fetchStockPrice = async (symbol) => {
  
  try {
      if (isDemoMode()) {
    console.log(`📈 Modo demo: ${symbol}`);
    return getDemoData('stocks')[symbol] || { 
      price: 100, change: 0, changePercent: 0 
    };
  }
    // Financial Modeling Prep - CORS habilitado
    const API_KEY = import.meta.env.VITE_FMP_KEY || 'demo';
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('FMP API Error');
    const result = await response.json();
    
    if (!result || result.length === 0) throw new Error('No stock data');
    
    const stock = result[0];
    return {
      price: stock.price,
      change: stock.change,
      changePercent: stock.changesPercentage
    };
  } catch {
    console.warn('FMP failed, using IEX Cloud');
    return fetchIEXCloud(symbol);
  }
};

const fetchIEXCloud = async (symbol) => {
  try {
    // IEX Cloud - CORS habilitado
    const API_KEY = import.meta.env.VITE_IEX_KEY || 'pk_your_key_here';
    const response = await fetch(
      `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('IEX API Error');
    const result = await response.json();
    
    return {
      price: result.latestPrice,
      change: result.change,
      changePercent: result.changePercent * 100
    };
  } catch {
    console.warn('All stock APIs failed, using mock data');
    // Datos mock directos sin función extra
    const mockData = {
      AAPL: { price: 182.34, change: 1.45, changePercent: 0.80 },
      MSFT: { price: 415.62, change: -2.15, changePercent: -0.51 },
      TSLA: { price: 245.80, change: 5.25, changePercent: 2.18 }
    };
    return mockData[symbol] || { price: 100, change: 0, changePercent: 0 };
  }
};