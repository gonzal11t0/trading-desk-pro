// /api/proxy.js - BACKEND (Vercel Serverless Function)
export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ 
      error: 'URL parameter is required',
      example: '/api/proxy?url=https://api.estadisticasbcra.com/api/merval'
    });
  }
  
  try {
    // Validar dominio
    const parsedUrl = new URL(url);
    const allowedDomains = [
      'api.estadisticasbcra.com',
      'query1.finance.yahoo.com',
      'api.allorigins.win',
      'mercados.ambito.com',
      'api.coingecko.com',
      'financialmodelingprep.com'
    ];
    
    const isAllowed = allowedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowed) {
      return res.status(403).json({ 
        error: 'Domain not allowed',
        domain: parsedUrl.hostname,
        allowedDomains 
      });
    }
    
    // Headers para evitar ser bloqueado
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TradingDeskPro/2.0)',
        'Accept': 'application/json',
      },
      timeout: 10000
    };
    
    // Hacer la petición
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream error: ${response.status} ${response.statusText}`,
        url
      });
    }
    
    const data = await response.json();
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=60');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
}

// Manejar preflight CORS
export const config = {
  api: {
    externalResolver: true,
  },
};