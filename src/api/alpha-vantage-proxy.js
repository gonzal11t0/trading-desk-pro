// /api/alpha-vantage-proxy.js - VERSIÓN CORREGIDA
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { symbols } = req.query;
  
  if (!symbols) {
    return res.status(200).json([]); // Devolver array vacío en lugar de error
  }
  
  const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'IES8UTVYZYHUTNDV';
  
  try {
    const symbolArray = symbols.split(',');
    const results = [];
    
    // Solo procesar 3 símbolos para no exceder rate limits
    const symbolsToFetch = symbolArray.slice(0, 3);
    
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
        
        // Esperar 15 segundos entre llamadas (Alpha Vantage free: 5/min)
        await new Promise(resolve => setTimeout(resolve, 15000));
        
      } catch (symbolError) {
        console.error(`Error fetching ${symbol}:`, symbolError.message);
        // Añadir símbolo como mock
        results.push(createMockSymbol(symbol));
      }
    }
    
    console.log(`✅ Alpha Vantage: Returning ${results.length} items`);
    return res.status(200).json(results);
    
  } catch (error) {
    console.error('Alpha Vantage proxy error:', error.message);
    
    // SIEMPRE devolver un array, incluso si hay error
    const symbolArray = symbols ? symbols.split(',') : [];
    const mockResults = symbolArray.slice(0, 4).map(symbol => createMockSymbol(symbol));
    
    return res.status(200).json(mockResults);
  }
}

/**
 * Crear símbolo mock
 */
function createMockSymbol(symbol) {
  const mockPrices = {
    'GGAL': { price: 1250.50, change: 2.15 },
    'YPFD': { price: 8450.75, change: -0.71 },
    'PAMP': { price: 2345.25, change: 1.45 },
    'CEPU': { price: 856.30, change: 4.77 },
    'BMA': { price: 3450.60, change: 0.85 },
    'LOMA': { price: 1567.80, change: -1.25 },
    'CRES': { price: 890.40, change: 0.15 },
    'EDN': { price: 1230.20, change: 1.75 },
    'SPY': { price: 485.25, change: 0.73 },
    'AAPL': { price: 182.34, change: -1.63 },
    'MSFT': { price: 415.62, change: 0.45 },
    'GOOGL': { price: 142.25, change: 0.25 }
  };
  
  const mock = mockPrices[symbol] || { price: 100, change: 0 };
  
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
}

// ... mantener fetchAlphaVantageQuote igual