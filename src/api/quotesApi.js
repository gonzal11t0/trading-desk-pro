// src/api/quotesApi.js
export const error = (message, details = null) => {
  const err = new Error(message);
  err.details = details;
  throw err;
};

export const fetchQuotesData = async () => {
  try {
    // Vamos a obtener datos reales de múltiples fuentes
    const [
      sp500Data,
      nasdaqData, 
      bitcoinData,
      dolarData,
      mervalData,
      oroData
    ] = await Promise.all([
      fetchSP500(),
      fetchNASDAQ(),
      fetchBitcoin(),
      fetchDolarBlue(),
      fetchMerval(),
      fetchOro()
    ]);

    return [
      {
        symbol: 'S&P 500',
        price: formatNumber(sp500Data.price),
        change: `${sp500Data.change > 0 ? '+' : ''}${sp500Data.changePercent.toFixed(2)}%`,
        positive: sp500Data.change >= 0,
        volume: '4.2B'
      },
      {
        symbol: 'NASDAQ',
        price: formatNumber(nasdaqData.price),
        change: `${nasdaqData.change > 0 ? '+' : ''}${nasdaqData.changePercent.toFixed(2)}%`,
        positive: nasdaqData.change >= 0,
        volume: '3.8B'
      },
      {
        symbol: 'BTC/USD',
        price: formatCrypto(bitcoinData.price),
        change: `${bitcoinData.change > 0 ? '+' : ''}${bitcoinData.changePercent.toFixed(2)}%`,
        positive: bitcoinData.change >= 0,
        volume: '28.4B'
      },
      {
        symbol: 'DÓLAR BLUE',
        price: `$${dolarData.price}`,
        change: `${dolarData.change > 0 ? '+' : ''}${dolarData.changePercent.toFixed(2)}%`,
        positive: dolarData.change >= 0,
        volume: '85M'
      },
      {
        symbol: 'MERVAL',
        price: formatMerval(mervalData.price),
        change: `${mervalData.change > 0 ? '+' : ''}${mervalData.changePercent.toFixed(2)}%`,
        positive: mervalData.change >= 0,
        volume: '45M'
      },
      {
        symbol: 'ORO',
        price: `$${oroData.price.toFixed(2)}`,
        change: `${oroData.change > 0 ? '+' : ''}${oroData.changePercent.toFixed(2)}%`,
        positive: oroData.change >= 0,
        volume: '12.3B'
      }
    ];
  } catch (error) {
    console.warn('Error fetching quotes data:', error);
    return getMockQuotesData();
  }
};

// API para S&P 500 (usando ETF SPY como proxy)
const fetchSP500 = async () => {
  try {
    const response = await fetch(
      'https://api.allorigins.win/get?url=' + 
      encodeURIComponent('/api/yahoo/v8/finance/chart/SPY')
    );
    
    if (response.ok) {
      const result = await response.json();
      const data = JSON.parse(result.contents);
      const quote = data.chart.result[0];
      
      const current = quote.meta.regularMarketPrice;
      const previous = quote.meta.previousClose;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      
      return { price: current, change, changePercent };
    }
    throw new Error('SP500 fetch failed');
  } catch {
    // Fallback a datos estáticos aproximados
    return { price: 4567.89, change: 15.52, changePercent: 0.34 };
  }
};

// API para NASDAQ (usando ETF QQQ como proxy)
const fetchNASDAQ = async () => {
  try {
    const response = await fetch(
      'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/QQQ')
    );
    
    if (response.ok) {
      const result = await response.json();
      const data = JSON.parse(result.contents);
      const quote = data.chart.result[0];
      
      const current = quote.meta.regularMarketPrice;
      const previous = quote.meta.previousClose;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      
      // Ajustar a valores NASDAQ reales (QQQ ≈ 1/3 de NASDAQ)
      return { 
        price: current * 35, // Factor aproximado
        change: change * 35, 
        changePercent 
      };
    }
    throw new Error('NASDAQ fetch failed');
  } catch {
    return { price: 14210.45, change: 88.10, changePercent: 0.62 };
  }
};

// API para Bitcoin (CoinGecko)
const fetchBitcoin = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        price: data.bitcoin.usd,
        change: data.bitcoin.usd_24h_change,
        changePercent: data.bitcoin.usd_24h_change
      };
    }
    throw new Error('Bitcoin fetch failed');
  } catch {
    return { price: 42150.80, change: 887.15, changePercent: 2.15 };
  }
};

// API para Dólar Blue (Bluelytics)
const fetchDolarBlue = async () => {
  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
    
    if (response.ok) {
      const data = await response.json();
      const blue = data.blue;
      // Usar promedio como precio representativo
      const price = (blue.value_buy + blue.value_sell) / 2;
      
      // Para el cambio porcentual, necesitaríamos datos históricos
      // Por ahora usamos un valor placeholder
      return { 
        price: Math.round(price), 
        change: 5, 
        changePercent: 0.51 
      };
    }
    throw new Error('Dolar blue fetch failed');
  } catch {
    return { price: 985, change: 5, changePercent: 0.51 };
  }
};

export const fetchMerval = async () => {
  // Datos REALES del MERVAL (ACTUALIZAR PERIÓDICAMENTE)
  const realMervalData = {
    price: 1268300,      // ÚLTIMO VALOR REAL - ACTUALIZAR
    change: 12580,       // VARIACIÓN REAL - ACTUALIZAR  
    changePercent: 1.0,  // PORCENTAJE REAL - ACTUALIZAR
    lastUpdated: '2024-01-15',
    source: 'manual'
  };

  try {
    // 1) Intentar API del MERVAL
    const apiData = await fetchMervalAPI();

    if (apiData?.price > 1000000) {
      // Guardar para uso futuro
      localStorage.setItem(
        'mervalRealData',
        JSON.stringify({
          ...apiData,
          timestamp: Date.now()
        })
      );

      return apiData;
    }

    // Si la API respondió pero con datos inválidos
    error('Invalid MERVAL API response', apiData);

  } catch (err) {
    console.warn('MERVAL API failed, using manual data', err);
  }

  // 2) Fallback a datos manuales
  return realMervalData;
};


const fetchMervalAPI = async () => {
  try {
    // Intentar con Financial Modeling Prep
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/^MERV?apikey=YOUR_API_KEY'
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data[0]) {
        return {
          price: data[0].price,
          change: data[0].change,
          changePercent: data[0].changesPercentage
        };
      }
    }
    throw new Error('FMP no data');
  } catch {
    throw new Error('All APIs failed');
  }
};
// API para Oro (usando GLD ETF como proxy)
const fetchOro = async () => {
  try {
    // Opción 1: Metals-API (más precisa)
    const API_KEY = 'demo'; // Para testing, registrar en metals-api.com para producción
    const proxyUrl = 'https://api.allorigins.win/get?url=' +
      encodeURIComponent(`https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU`);
    
    const response = await fetch(proxyUrl);
    
    if (response.ok) {
      const result = await response.json();
      const data = JSON.parse(result.contents);
      
      // XAU es USD por onza de oro
      // Para obtener onzas por USD: 1 / rate
      const pricePerOunce = 1 / data.rates.XAU;
      
      return { 
        price: pricePerOunce,
        change: 15.25, // Placeholder - necesitaríamos datos históricos
        changePercent: 0.77
      };
    }
    
    throw new Error('Metals-API failed');
  } catch {
    // Opción 2: Usar datos de Yahoo Finance más precisos
    return fetchOroYahoo();
  }
};

const fetchOroYahoo = async () => {
  try {
    const proxyUrl = 'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    
    const response = await fetch(proxyUrl);
    
    if (response.ok) {
      const result = await response.json();
      const data = JSON.parse(result.contents);
      const quote = data.chart.result[0];
      
      const current = quote.meta.regularMarketPrice;
      const previous = quote.meta.previousClose;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      
      // GC=F es el futuro del oro, más preciso
      return { 
        price: current, 
        change, 
        changePercent 
      };
    }
    throw new Error('Yahoo Gold failed');
  } catch {
    return { price: 1987.50, change: 15.25, changePercent: 0.77 };
  }
};
// Funciones de formato
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatCrypto = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatMerval = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US').format(num);
};

// Fallback a datos mock
const getMockQuotesData = () => {
  return [
    { symbol: 'S&P 500', price: '4,567.89', change: '+0.34%', positive: true, volume: '4.2B' },
    { symbol: 'NASDAQ', price: '14,210.45', change: '+0.62%', positive: true, volume: '3.8B' },
    { symbol: 'BTC/USD', price: '42,150.80', change: '+2.15%', positive: true, volume: '28.4B' },
    { symbol: 'DÓLAR BLUE', price: '$985', change: '+0.51%', positive: true, volume: '85M' },
    { symbol: 'MERVAL', price: '1.250K', change: '+0.79%', positive: true, volume: '45M' },
    { symbol: 'ORO', price: '$1,987.50', change: '+0.77%', positive: true, volume: '12.3B' }
  ];
};