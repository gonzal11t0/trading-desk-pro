// src/api/mervalApi.js - VERSIÓN COMPLETA Y ORGANIZADA

const EODDATA_API_KEY = '18rkWcnCcIEIIbVRpRDnZOzB';

// ========== FUNCIONES PRINCIPALES EXPORTADAS ==========
export const fetchMervalData = async () => {
  try {
    const mervalData = await fetchLatestMervalQuote();
    if (mervalData) {
      console.log(`📈 MERVAL REAL: ${mervalData.formattedPrice} (${mervalData.changePercent >= 0 ? '+' : ''}${mervalData.changePercent.toFixed(2)}%)`);
      return mervalData;
    }
    
    return await fetchMervalSymbolData();
  } catch (error) {
    console.warn('Error con EODData API:', error.message);
    return getRealisticMockMervalData();
  }
};

export const fetchMervalStocks = async () => {
  try {
    // TODO: Implementar con EODData para acciones argentinas reales
    return getMockMervalStocks();
  } catch {
    return getMockMervalStocks();
  }
};

export const fetchMervalHistory = async (period = '1m') => {
  try {
    return generateMockHistory(period);
  } catch {
    return generateMockHistory(period);
  }
};

// ========== FUNCIONES DE EODDATA API ==========
const fetchLatestMervalQuote = async () => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateFormats = [
      today.toISOString().split('T')[0],
      yesterday.toISOString().split('T')[0]
    ];
    
    for (const dateStamp of dateFormats) {
      const response = await fetch(
        `/api/eoddata/Quote/List/INDEX?ApiKey=${EODDATA_API_KEY}&DateStamp=${dateStamp}`,
        { 
          timeout: 8000,
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (response.ok) {
        const quotes = await response.json();
        const mervQuote = quotes?.find(q => q.code === 'MERV');
        
        if (mervQuote && mervQuote.close && mervQuote.close > 0) {
          return formatMervalData(mervQuote, dateStamp);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return null;
  } catch (error) {
    console.warn('Error fetching quote:', error.message);
    return null;
  }
};

const fetchMervalSymbolData = async () => {
  try {
    const response = await fetch(
      `/api/eoddata/Symbol/List/INDEX?ApiKey=${EODDATA_API_KEY}`,
      { 
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      }
    );
    
    if (response.ok) {
      const symbols = await response.json();
      const mervalSymbol = symbols?.find(s => s.code === 'MERV');
      
      if (mervalSymbol && mervalSymbol.close) {
        return {
          price: mervalSymbol.close,
          formattedPrice: new Intl.NumberFormat('es-AR').format(mervalSymbol.close),
          change: mervalSymbol.change || 0,
          changePercent: mervalSymbol.changePercent || 0,
          volume: mervalSymbol.volume || 0,
          timestamp: mervalSymbol.dateStamp ? `${mervalSymbol.dateStamp}T00:00:00Z` : new Date().toISOString(),
          source: 'EODData API',
          symbol: 'MERVAL',
          name: 'Argentina Merval Index',
          marketStatus: getMarketStatus()
        };
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error fetching symbol data:', error.message);
    return null;
  }
};

// ========== FUNCIONES DE FORMATEO Y UTILIDAD ==========
const formatMervalData = (apiData, dateStamp) => {
  const price = apiData.close || apiData.previous || 0;
  const change = apiData.change || 0;
  const changePercent = apiData.changePercent || 
    (change && price ? (change / (price - change)) * 100 : 0);
  
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  return {
    price: parseFloat(price),
    formattedPrice,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: apiData.volume || 0,
    timestamp: dateStamp ? `${dateStamp}T00:00:00Z` : new Date().toISOString(),
    source: 'EODData API',
    symbol: 'MERVAL',
    name: 'Argentina Merval Index',
    marketStatus: getMarketStatus(),
    rawData: apiData
  };
};

const getMarketStatus = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = hour >= 11 && hour < 17;
  
  if (!isWeekday) return 'Cerrado (Fin de semana)';
  if (isMarketHours) return 'Abierto';
  if (hour < 11) return 'Pre-apertura';
  return 'Cerrado';
};

// ========== FUNCIONES DE FALLBACK/MOCK ==========
const getRealisticMockMervalData = () => {
  const now = new Date();
  const isMarketOpen = getMarketStatus() === 'Abierto';
  
  const basePrice = 3211242;
  const baseChange = -19472;
  
  const liveVariation = isMarketOpen ? (Math.random() * 0.02 - 0.01) : 0;
  const livePrice = basePrice * (1 + liveVariation);
  const liveChange = baseChange + (livePrice - basePrice);
  
  return {
    price: parseFloat(livePrice.toFixed(2)),
    formattedPrice: new Intl.NumberFormat('es-AR').format(livePrice),
    change: parseFloat(liveChange.toFixed(2)),
    changePercent: parseFloat(((liveChange / (livePrice - liveChange)) * 100).toFixed(2)),
    volume: isMarketOpen ? Math.floor(Math.random() * 50000000) + 20000000 : 0,
    timestamp: now.toISOString(),
    source: 'Trading Desk Pro (Simulación)',
    symbol: 'MERVAL',
    name: 'Argentina Merval Index',
    marketStatus: getMarketStatus(),
    note: 'Datos de demostración'
  };
};

const getMockMervalStocks = () => [
  {
    symbol: 'GGAL', name: 'Grupo Financiero Galicia',
    price: 2500.50, change: 45.25, changePercent: 1.84,
    volume: 1250000, marketCap: 1250000000000
  },
  {
    symbol: 'YPFD', name: 'YPF',
    price: 8500.75, change: -125.50, changePercent: -1.45,
    volume: 850000, marketCap: 9800000000000
  },
  {
    symbol: 'PAMP', name: 'Pampa Energía',
    price: 4200.25, change: 85.75, changePercent: 2.08,
    volume: 620000, marketCap: 4500000000000
  }
  // ... resto de acciones
];

const generateMockHistory = (period) => {
  const basePrice = 3211242; // Usar precio real del MERVAL
  const dataPoints = {
    '1d': 24, '1w': 7, '1m': 30, '3m': 90, '1y': 365
  };
  
  const points = dataPoints[period] || 30;
  const history = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 0.02;
    const price = basePrice * (1 + (i * 0.0005) + variation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 20000000
    });
  }
  
  return history;
};

// ========== EXPORT DEFAULT ==========
export default {
  fetchMervalData,
  fetchMervalStocks,
  fetchMervalHistory
};