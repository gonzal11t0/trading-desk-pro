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
    // Usar Financial Modeling Prep directamente para S&P 500
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/^GSPC?apikey=0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA'
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
    
    // Fallback: Yahoo Finance con URL corregida
    const yahooResponse = await fetch(
      'https://api.allorigins.win/get?url=' + 
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/^GSPC')
    );
    
    if (yahooResponse.ok) {
      const result = await yahooResponse.json();
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
    return { price: 4567.89, change: 15.52, changePercent: 0.34 };
  }
};

// API para NASDAQ (usando ETF QQQ como proxy)
const fetchNASDAQ = async () => {
  try {
    // Usar índice NASDAQ real (^IXIC) en lugar de QQQ
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/^IXIC?apikey=0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA'
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
    
    // Fallback a Yahoo Finance
    const yahooResponse = await fetch(
      'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/^IXIC')
    );
    
    if (yahooResponse.ok) {
      const result = await yahooResponse.json();
      const data = JSON.parse(result.contents);
      const quote = data.chart.result[0];
      
      const current = quote.meta.regularMarketPrice;
      const previous = quote.meta.previousClose;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      
      return { 
        price: current,
        change: change, 
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

const fetchMervalAPI = async () => {
  try {
    // Opción 1: Alpha Vantage (más confiable para índices globales)
    const alphaResponse = await fetch(
      'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MERV.BA&apikey=0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA'
    );
    
    if (alphaResponse.ok) {
      const data = await alphaResponse.json();
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        const change = parseFloat(data['Global Quote']['09. change']);
        const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
        
        return {
          price: price * 1000, // Ajustar a valor real del índice
          change: change * 1000,
          changePercent: changePercent
        };
      }
    }
    
    // Opción 2: Yahoo Finance para MERVAL
    const yahooResponse = await fetch(
      'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/^MERV')
    );
    
    if (yahooResponse.ok) {
      const result = await yahooResponse.json();
      const data = JSON.parse(result.contents);
      
      if (data.chart?.result?.[0]) {
        const quote = data.chart.result[0];
        const current = quote.meta.regularMarketPrice;
        const previous = quote.meta.previousClose;
        const change = current - previous;
        const changePercent = (change / previous) * 100;
        
        return {
          price: current,
          change: change,
          changePercent: changePercent
        };
      }
    }
    
    throw new Error('All MERVAL APIs failed');
  } catch (error) {
    console.warn('MERVAL API error:', error);
    throw error;
  }
};

export const fetchMerval = async () => {
  // Datos REALES del MERVAL (como respaldo)
  const realMervalData = {
    price: 1268300,
    change: 12580,  
    changePercent: 1.0,
    lastUpdated: '2024-01-15',
    source: 'manual'
  };

  try {
    const apiData = await fetchMervalAPI();

    // Validar que los datos sean razonables
    if (apiData?.price > 100000 && apiData?.price < 5000000) {
      // Guardar para uso futuro
      localStorage.setItem(
        'mervalRealData',
        JSON.stringify({
          ...apiData,
          timestamp: Date.now()
        })
      );
      return apiData;
    } else {
      console.warn('MERVAL data out of expected range:', apiData);
      return realMervalData;
    }

  } catch (err) {
    console.warn('MERVAL API failed, using manual data', err);
    
    // Intentar recuperar datos guardados
    const savedData = localStorage.getItem('mervalRealData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Usar datos guardados si no son muy viejos (menos de 1 hora)
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed;
      }
    }
    
    return realMervalData;
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
    { symbol: 'S&P 500', price: '0', change: '+0.34%', positive: true, volume: '4.2B' },
    { symbol: 'NASDAQ', price: '0', change: '+0.62%', positive: true, volume: '3.8B' },
    { symbol: 'BTC/USD', price: '0', change: '+2.15%', positive: true, volume: '28.4B' },
    { symbol: 'DÓLAR BLUE', price: '0', change: '+0.51%', positive: true, volume: '85M' },
    { symbol: 'MERVAL', price: '0', change: '+0.79%', positive: true, volume: '45M' },
    { symbol: 'ORO', price: '0', change: '+0.77%', positive: true, volume: '12.3B' }
  ];
};