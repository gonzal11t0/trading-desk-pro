// src/api/quotesApi.js 

/**
 * Función principal para obtener datos de cotizaciones
 */
export const fetchQuotesData = async () => {
  try {
    const [
      sp500Data,
      nasdaqData, 
      bitcoinData,
      dolarData,
      mervalData,
      oroData
    ] = await Promise.allSettled([
      fetchSP500(),
      fetchNASDAQ(),
      fetchBitcoin(),
      fetchDolarBlue(),
      fetchMerval(),
      fetchOro()
    ]);

    // Procesar resultados, usar fallback si falla alguna
    const processResult = (result, fallbackData) => 
      result.status === 'fulfilled' ? result.value : fallbackData;

    return [
      createQuoteData(
        'S&P 500',
        processResult(sp500Data, { price: 4567.89, change: 15.52, changePercent: 0.34 }),
        '4.2B'
      ),
      createQuoteData(
        'NASDAQ',
        processResult(nasdaqData, { price: 14210.45, change: 88.10, changePercent: 0.62 }),
        '3.8B'
      ),
      createQuoteData(
        'BTC/USD',
        processResult(bitcoinData, { price: 42150.80, change: 887.15, changePercent: 2.15 }),
        '28.4B'
      ),
      createQuoteData(
        'DÓLAR BLUE',
        processResult(dolarData, { price: 985, change: 5, changePercent: 0.51 }),
        '85M'
      ),
      createQuoteData(
        'MERVAL',
        processResult(mervalData, { price: 1268300, change: 12580, changePercent: 1.0 }),
        '45M'
      ),
      createQuoteData(
        'ORO',
        processResult(oroData, { price: 1987.50, change: 15.25, changePercent: 0.77 }),
        '12.3B'
      )
    ];
  } catch {
    return getMockQuotesData();
  }
};

/**
 * Crear objeto de cotización estandarizado
 */
const createQuoteData = (symbol, marketData, volume) => {
  const isPositive = marketData.change >= 0;
  const changeSign = isPositive ? '+' : '';
  
  return {
    symbol,
    price: formatPrice(symbol, marketData.price),
    change: `${changeSign}${marketData.changePercent.toFixed(2)}%`,
    positive: isPositive,
    volume,
    raw: marketData
  };
};

/**
 * Formatear precio según símbolo
 */
const formatPrice = (symbol, price) => {
  if (symbol === 'MERVAL') {
    return formatMervalPrice(price);
  }
  
  if (symbol === 'BTC/USD') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }
  
  if (symbol === 'ORO' || symbol === 'S&P 500' || symbol === 'NASDAQ') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }
  
  return `$${Math.round(price)}`;
};

/**
 * Formatear precio MERVAL
 */
const formatMervalPrice = (price) => {
  if (price >= 1000000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US').format(price);
};

/**
 * Obtener S&P 500
 */
const fetchSP500 = async () => {
  try {
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/^GSPC?apikey=0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA',
      { timeout: 8000 }
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
  } catch {
    // Fallback implícito
  }
  return { price: 4567.89, change: 15.52, changePercent: 0.34 };
};

/**
 * Obtener NASDAQ
 */
const fetchNASDAQ = async () => {
  try {
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/^IXIC?apikey=0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA',
      { timeout: 8000 }
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
  } catch {
    // Fallback implícito
  }
  return { price: 14210.45, change: 88.10, changePercent: 0.62 };
};

/**
 * Obtener Bitcoin
 */
const fetchBitcoin = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
      { timeout: 8000 }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.bitcoin?.usd) {
        return {
          price: data.bitcoin.usd,
          change: data.bitcoin.usd_24h_change,
          changePercent: data.bitcoin.usd_24h_change
        };
      }
    }
  } catch {
    // Fallback implícito
  }
  return { price: 42150.80, change: 887.15, changePercent: 2.15 };
};

/**
 * Obtener Dólar Blue
 */
const fetchDolarBlue = async () => {
  try {
    const response = await fetch(
      'https://api.bluelytics.com.ar/v2/latest',
      { timeout: 8000 }
    );
    
    if (response.ok) {
      const data = await response.json();
      const blue = data.blue;
      if (blue?.value_buy && blue?.value_sell) {
        const price = (blue.value_buy + blue.value_sell) / 2;
        return { 
          price: Math.round(price), 
          change: 5, 
          changePercent: 0.51 
        };
      }
    }
  } catch {
    // Fallback implícito
  }
  return { price: 985, change: 5, changePercent: 0.51 };
};

/**
 * Obtener MERVAL
 */
export const fetchMerval = async () => {
  try {
    const response = await fetch(
      'https://api.estadisticasbcra.com/api/merval',
      { timeout: 8000 }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length >= 2) {
        const latest = data[data.length - 1];
        const previous = data[data.length - 2];
        const change = latest.v - previous.v;
        const changePercent = (change / previous.v) * 100;
        
        return {
          price: latest.v,
          change,
          changePercent
        };
      }
    }
  } catch {
    // Intentar datos guardados
    const savedData = localStorage.getItem('mervalRealData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed;
      }
    }
  }
  
  return { price: 1268300, change: 12580, changePercent: 1.0 };
};

/**
 * Obtener Oro
 */
const fetchOro = async () => {
  try {
    const proxyUrl = 'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    
    const response = await fetch(proxyUrl, { timeout: 8000 });
    
    if (response.ok) {
      const result = await response.json();
      const data = JSON.parse(result.contents);
      const quote = data.chart?.result?.[0];
      
      if (quote?.meta) {
        const current = quote.meta.regularMarketPrice;
        const previous = quote.meta.previousClose;
        const change = current - previous;
        const changePercent = (change / previous) * 100;
        
        return { 
          price: current, 
          change, 
          changePercent 
        };
      }
    }
  } catch {
    // Fallback implícito
  }
  return { price: 1987.50, change: 15.25, changePercent: 0.77 };
};

/**
 * Datos mock de respaldo
 */
const getMockQuotesData = () => [
  { symbol: 'S&P 500', price: '4,567.89', change: '+0.34%', positive: true, volume: '4.2B' },
  { symbol: 'NASDAQ', price: '14,210.45', change: '+0.62%', positive: true, volume: '3.8B' },
  { symbol: 'BTC/USD', price: '42,150.80', change: '+2.15%', positive: true, volume: '28.4B' },
  { symbol: 'DÓLAR BLUE', price: '$985', change: '+0.51%', positive: true, volume: '85M' },
  { symbol: 'MERVAL', price: '1,268K', change: '+1.00%', positive: true, volume: '45M' },
  { symbol: 'ORO', price: '1,987.50', change: '+0.77%', positive: true, volume: '12.3B' }
];

// Exportar funciones adicionales si son necesarias
export const saveMervalData = (data) => {
  try {
    localStorage.setItem('mervalRealData', JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch {
    // Fallo silencioso
  }
};

export default {
  fetchQuotesData,
  fetchMerval,
  saveMervalData
};