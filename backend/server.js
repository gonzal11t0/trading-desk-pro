// backend/server.js
const express = require('express');
const cors = require('cors');
// Importar la clase (NOTA: puede requerir .default según la versión)
const YahooFinance = require('yahoo-finance2').default; 

// Crear una instancia de la clase ANTES de usarla
const yahooFinance = new YahooFinance();

const app = express();
app.use(cors());
app.use(express.json());

const tickerMap = {
  'YPFD': 'YPF',
  'GGAL': 'GGAL',
  'PAMP': 'PAMP',
  'BMA': 'BMA',
  'TECO2': 'TECO2.BA',
  'TGSU2': 'TGSU2.BA',
  'ALUA': 'ALUA.BA',
  'CEPU': 'CEPU.BA',
  'EDN': 'EDN.BA',
  'COME': 'COME.BA'
};

app.get('/api/company/:ticker', async (req, res) => {
  try {
    const ticker = tickerMap[req.params.ticker] || req.params.ticker;
    
    // Usar la instancia yahooFinance (que ya creamos)
    const quote = await yahooFinance.quote(ticker);
    
    // Para datos históricos (si los necesitás)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    const historical = await yahooFinance.historical(ticker, {
      period1: startDate,
      period2: endDate,
      interval: '1mo'
    });

    res.json({
      ticker: req.params.ticker,
      nombre: quote.longName || quote.shortName,
      precio: quote.regularMarketPrice,
      per: quote.trailingPE,
      marketCap: quote.marketCap,
      historical: historical.slice(0, 4)
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('✅ Backend (v3) corriendo en http://localhost:3001');
});