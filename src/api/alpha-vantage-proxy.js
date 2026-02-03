// /api/alpha-vantage-proxy.js
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { symbols, batch = 'false' } = req.query;
  
  if (!symbols) {
    return res.status(400).json({ error: 'Symbols parameter required' });
  }
  
  const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'IES8UTVYZYHUTNDV';
  
  try {
    const symbolArray = symbols.split(',');
    const results = [];
    
    // Alpha Vantage solo permite 5 símbolos por minuto en el plan gratis
    const symbolsToFetch = symbolArray.slice(0, 5);
    
    for (const symbol of symbolsToFetch) {
      try {
        const quote = await fetchAlphaVantageQuote(symbol, ALPHA_VANTAGE_KEY);
        
        if (quote) {
          results.push({
            ticker: symbol,
            variation: quote.changePercent,
            price: quote.price,
            previousClose: quote.previousClose,
            volume: quote.volume,
            updatedAt: new Date().toISOString(),
            source: 'alpha-vantage',
            real: true
          });
        }
        
        // IMPORTANTE: Alpha Vantage free tier tiene rate limit de 5 llamadas/minuto
        // Esperar 13 segundos entre llamadas para no exceder el límite
        await new Promise(resolve => setTimeout(resolve, 13000));
        
      } catch (symbolError) {
        console.error(`Error fetching ${symbol}:`, symbolError.message);
        // Continuar con siguiente símbolo
      }
    }
    
    if (results.length > 0) {
      console.log(`✅ Alpha Vantage: Got ${results.length} real quotes`);
      return res.status(200).json(results);
    }
    
    // Si no hay datos reales, devolver mock
    throw new Error('No real data from Alpha Vantage');
    
  } catch (error) {
    console.error('Alpha Vantage proxy error:', error.message);
    
    // Datos mock como fallback
    const mockData = getMockData(symbols);
    return res.status(200).json(mockData);
  }
}

/**
 * Obtener quote de Alpha Vantage
 */
async function fetchAlphaVantageQuote(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  console.log(`🔗 Fetching Alpha Vantage for: ${symbol}`);
  
  const response = await fetch(url, { timeout: 10000 });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Alpha Vantage devuelve los datos en 'Global Quote'
  const quote = data['Global Quote'];
  
  if (!quote || !quote['05. price']) {
    throw new Error('Invalid Alpha Vantage response');
  }
  
  const price = parseFloat(quote['05. price']);
  const previousClose = parseFloat(quote['08. previous close']);
  const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
  const volume = parseInt(quote['06. volume']) || 0;
  
  return {
    price,
    previousClose,
    changePercent,
    volume
  };
}

/**
 * Datos mock como fallback
 */
function getMockData(symbols) {
  const symbolArray = symbols.split(',');
  const allMockData = {
    // Acciones argentinas
    'GGAL': { price: 1250.50, change: 2.15 },
    'YPFD': { price: 8450.75, change: -0.71 },
    'PAMP': { price: 2345.25, change: 1.45 },
    'CEPU': { price: 856.30, change: 4.77 },
    'BMA': { price: 3450.60, change: 0.85 },
    'LOMA': { price: 1567.80, change: -1.25 },
    'CRES': { price: 890.40, change: 0.15 },
    'EDN': { price: 1230.20, change: 1.75 },
    'TXAR': { price: 3200.80, change: -0.45 },
    'MIRG': { price: 1850.30, change: 0.90 },
    
    // CEDEARs
    'SPY': { price: 485.25, change: 0.73 },
    'MSTR': { price: 675.40, change: -8.14 },
    'NVDA': { price: 525.30, change: 0.45 },
    'META': { price: 368.90, change: -0.75 },
    'AAPL': { price: 182.34, change: -1.63 },
    'GOOGL': { price: 142.25, change: 0.25 },
    'MSFT': { price: 415.62, change: 0.45 },
    'TSLA': { price: 245.80, change: -4.03 },
    'AMZN': { price: 155.45, change: 1.25 },
    'MELI': { price: 1780.50, change: 2.15 }
  };
  
  return symbolArray.map(symbol => {
    const mock = allMockData[symbol] || { price: 100, change: 0 };
    
    return {
      ticker: symbol,
      variation: mock.change,
      price: mock.price,
      previousClose: mock.price * (1 - mock.change / 100),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      updatedAt: new Date().toISOString(),
      source: 'mock',
      real: false
    };
  });
}