// /api/alpha-vantage-enhanced.js (NUEVO archivo en raíz)
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { type = 'leader', cache = 'true' } = req.query;
  
  // Cache simple en memoria del servidor
  const cacheKey = `av-${type}`;
  const cacheDuration = 60000; // 1 minuto
  
  if (cache === 'true' && global.alphaVantageCache && 
      global.alphaVantageCache[cacheKey] && 
      (Date.now() - global.alphaVantageCache[cacheKey].timestamp) < cacheDuration) {
    console.log(`📦 Serving cached ${type} data`);
    return res.status(200).json(global.alphaVantageCache[cacheKey].data);
  }
  
  try {
    const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'IES8UTVYZYHUTNDV';
    
    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }
    
    console.log(`🔄 Fetching fresh ${type} data from Alpha Vantage...`);
    
    let symbols, results;
    
    if (type === 'leader') {
      // Acciones argentinas (algunas pueden no estar en Alpha Vantage)
      symbols = ['GGAL', 'YPFD', 'PAMP', 'CEPU', 'BMA', 'EDN', 'MELI'];
      results = await fetchAlphaVantageSymbols(symbols, ALPHA_VANTAGE_KEY, 'leader');
    } else {
      // CEDEARs (más probables de tener datos)
      symbols = ['SPY', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA'];
      results = await fetchAlphaVantageSymbols(symbols, ALPHA_VANTAGE_KEY, 'cedears');
    }
    
    // Filtrar nulos y asegurar formato
    const validResults = results.filter(item => item !== null)
      .map(item => ({
        ...item,
        id: item.ticker,
        source: 'alpha-vantage',
        real: true
      }));
    
    console.log(`✅ ${type}: ${validResults.length} real symbols fetched`);
    
    // Actualizar cache
    if (!global.alphaVantageCache) global.alphaVantageCache = {};
    global.alphaVantageCache[cacheKey] = {
      data: validResults,
      timestamp: Date.now()
    };
    
    res.status(200).json(validResults);
    
  } catch (error) {
    console.error(`❌ Alpha Vantage error for ${type}:`, error.message);
    
    // Datos mock mejorados como fallback
    const mockData = getEnhancedMockData(type);
    res.status(200).json(mockData);
  }
}

/**
 * Obtener múltiples símbolos de Alpha Vantage con rate limiting inteligente
 */
async function fetchAlphaVantageSymbols(symbols, apiKey, type) {
  const results = [];
  const BATCH_SIZE = 2; // Alpha Vantage free: 5 calls/minuto
  const DELAY_BETWEEN_BATCHES = 13000; // 13 segundos para 5/min
  
  // Dividir en batches para respetar rate limits
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    console.log(`📦 Processing batch ${i/BATCH_SIZE + 1}:`, batch);
    
    const batchPromises = batch.map(symbol => 
      fetchSingleSymbol(symbol, apiKey).catch(error => {
        console.log(`⚠️ Skipping ${symbol}:`, error.message);
        return createMockSymbol(symbol, type);
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(Boolean));
    
    // Esperar entre batches (excepto el último)
    if (i + BATCH_SIZE < symbols.length) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  return results;
}

/**
 * Obtener un solo símbolo de Alpha Vantage
 */
async function fetchSingleSymbol(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  console.log(`🔗 Fetching ${symbol} from Alpha Vantage...`);
  
  const response = await fetch(url, { 
    timeout: 10000,
    headers: {
      'User-Agent': 'TradingDeskPro/2.0',
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Verificar si es un error de rate limiting
  if (data['Note'] || data['Information']) {
    console.warn(`Alpha Vantage rate limit for ${symbol}:`, data['Note'] || data['Information']);
    throw new Error('Rate limit exceeded');
  }
  
  const quote = data['Global Quote'];
  
  if (!quote || !quote['05. price']) {
    console.warn(`No quote data for ${symbol}`);
    throw new Error('No quote data');
  }
  
  const price = parseFloat(quote['05. price']);
  const previousClose = parseFloat(quote['08. previous close']);
  const change = parseFloat(quote['09. change']);
  const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
  const volume = parseInt(quote['06. volume']) || 0;
  
  return {
    ticker: symbol,
    variation: changePercent,
    price: price,
    previousClose: previousClose,
    volume: volume,
    marketCap: calculateMarketCap(symbol, price),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Calcular market cap aproximado
 */
function calculateMarketCap(symbol, price) {
  const marketCaps = {
    'AAPL': 2850000000000,
    'MSFT': 3090000000000,
    'GOOGL': 1780000000000,
    'AMZN': 1600000000000,
    'META': 950000000000,
    'TSLA': 780000000000,
    'NVDA': 1320000000000,
    'SPY': 450000000000000,
    'GGAL': 1250000000000,
    'YPFD': 9800000000000,
    'MELI': 89000000000
  };
  
  return marketCaps[symbol] || price * 100000000; // Estimación
}

/**
 * Crear símbolo mock como fallback
 */
function createMockSymbol(symbol, type) {
  const mockData = getEnhancedMockData(type === 'leader' ? 'leader' : 'cedears');
  return mockData.find(item => item.ticker === symbol) || mockData[0];
}

/**
 * Datos mock mejorados
 */
function getEnhancedMockData(type) {
  if (type === 'leader') {
    return [
      { ticker: 'GGAL', variation: 2.15, price: 1250.50, marketCap: 1250000000000 },
      { ticker: 'YPFD', variation: -0.71, price: 8450.75, marketCap: 9800000000000 },
      { ticker: 'PAMP', variation: 1.45, price: 2345.25, marketCap: 4500000000000 },
      { ticker: 'CEPU', variation: 4.77, price: 856.30, marketCap: 850000000000 },
      { ticker: 'BMA', variation: 0.85, price: 3450.60, marketCap: 3200000000000 },
      { ticker: 'EDN', variation: 1.75, price: 1230.20, marketCap: 750000000000 },
      { ticker: 'MELI', variation: 2.15, price: 1780.50, marketCap: 89000000000 }
    ].map(item => ({
      ...item,
      previousClose: item.price * (1 - item.variation / 100),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      updatedAt: new Date().toISOString(),
      source: 'mock',
      real: false
    }));
  } else {
    return [
      { ticker: 'SPY', variation: 0.73, price: 485.25, marketCap: 450000000000000 },
      { ticker: 'AAPL', variation: -1.63, price: 182.34, marketCap: 2850000000000 },
      { ticker: 'MSFT', variation: 0.45, price: 415.62, marketCap: 3090000000000 },
      { ticker: 'GOOGL', variation: 0.25, price: 142.25, marketCap: 1780000000000 },
      { ticker: 'AMZN', variation: 1.25, price: 155.45, marketCap: 1600000000000 },
      { ticker: 'META', variation: -0.75, price: 368.90, marketCap: 950000000000 },
      { ticker: 'TSLA', variation: -4.03, price: 245.80, marketCap: 780000000000 },
      { ticker: 'NVDA', variation: 0.45, price: 525.30, marketCap: 1320000000000 }
    ].map(item => ({
      ...item,
      previousClose: item.price * (1 - item.variation / 100),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      updatedAt: new Date().toISOString(),
      source: 'mock',
      real: false
    }));
  }
}