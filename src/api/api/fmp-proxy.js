// /api/fmp-proxy.js (nuevo archivo en la raíz)
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { symbols, type = 'quote' } = req.query;
  
  if (!symbols) {
    return res.status(400).json({ error: 'Symbols parameter required' });
  }
  
  try {
    const FMP_API_KEY = process.env.FMP_API_KEY || '0GPS5760CgTF3sDOzQUTRZgMY2GUJvrA';
    const url = `https://financialmodelingprep.com/stable/${type}/${symbols}?apikey=${FMP_API_KEY}`;
    
    console.log('🔄 Proxying to FMP:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from FMP',
      message: error.message 
    });
  }
}