// /api/treemap-data.js (archivo NUEVO en raíz)
export default async function handler(req, res) {
  // Siempre permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { type = 'leader' } = req.query;
  
  console.log(`🎭 Serving mock treemap data for: ${type}`);
  
  // Datos mock garantizados
  const data = type === 'leader' ? getLeaderMock() : getCedearsMock();
  
  // Asegurar que cada item tenga todas las propiedades requeridas
  const safeData = data.map(item => ({
    id: item.ticker,
    ticker: item.ticker,
    variation: Number(item.variation) || 0,
    price: Number(item.price) || 100,
    marketCap: Number(item.marketCap) || 0,
    source: 'mock',
    real: false,
    previousClose: item.price * (1 - item.variation / 100),
    volume: Math.floor(Math.random() * 1000000) + 100000,
    updatedAt: new Date().toISOString()
  }));
  
  res.status(200).json(safeData);
}

function getLeaderMock() {
  return [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50, marketCap: 1250000000000 },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75, marketCap: 9800000000000 },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25, marketCap: 4500000000000 },
    { ticker: 'CEPU', variation: 4.77, price: 856.30, marketCap: 850000000000 },
    { ticker: 'BMA', variation: 0.85, price: 3450.60, marketCap: 3200000000000 },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80, marketCap: 1800000000000 },
    { ticker: 'CRES', variation: 0.15, price: 890.40, marketCap: 950000000000 },
    { ticker: 'EDN', variation: 1.75, price: 1230.20, marketCap: 750000000000 }
  ];
}

function getCedearsMock() {
  return [
    { ticker: 'SPY', variation: 0.73, price: 485.25, marketCap: 450000000000000 },
    { ticker: 'AAPL', variation: -1.63, price: 182.34, marketCap: 2850000000000 },
    { ticker: 'MSFT', variation: 0.45, price: 415.62, marketCap: 3090000000000 },
    { ticker: 'GOOGL', variation: 0.25, price: 142.25, marketCap: 1780000000000 },
    { ticker: 'AMZN', variation: 1.25, price: 155.45, marketCap: 1600000000000 },
    { ticker: 'META', variation: -0.75, price: 368.90, marketCap: 950000000000 },
    { ticker: 'TSLA', variation: -4.03, price: 245.80, marketCap: 780000000000 },
    { ticker: 'NVDA', variation: 0.45, price: 525.30, marketCap: 1320000000000 }
  ];
}