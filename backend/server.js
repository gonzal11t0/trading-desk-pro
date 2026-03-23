const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default; 
const getLetrasMock = require('./scripts/letrasMock');

console.log('🚀 Iniciando server.js...');
const yahooFinance = new YahooFinance();

const app = express();
app.use(cors({
  origin: [
    'https://trading-desk-pro.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

const tickerMap = {
  'YPFD': 'YPF', 'GGAL': 'GGAL', 'PAMP': 'PAMP', 'BMA': 'BMA',
  'TECO2': 'TECO2.BA', 'TGSU2': 'TGSU2.BA', 'ALUA': 'ALUA.BA',
  'CEPU': 'CEPU.BA', 'EDN': 'EDN.BA', 'COME': 'COME.BA'
};

app.get('/api/company/:ticker', async (req, res) => {
  try {
    const ticker = tickerMap[req.params.ticker] || req.params.ticker;
    const quote = await yahooFinance.quote(ticker);
    const endDate = new Date(); const startDate = new Date(); startDate.setMonth(startDate.getMonth() - 3);
    const historical = await yahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1mo' });
    res.json({ ticker: req.params.ticker, nombre: quote.longName || quote.shortName, precio: quote.regularMarketPrice, per: quote.trailingPE, marketCap: quote.marketCap, historical: historical.slice(0, 4) });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========== DATOS MOCK ==========
const scrapeBonosIOL = require('./scripts/get_bonos_iol');
app.get('/api/bonos', async (req, res) => {
  try {
    const data = await scrapeBonosIOL();
    res.json(data);
  } catch (error) {
    console.error('Error en /api/bonos:', error.message);
    res.status(500).json({ error: error.message });
  }
});


const scrapeLetrasIOL = require('./scripts/get_letras_iol');

app.get('/api/letras', async (req, res) => {
  try {
    const data = await scrapeLetrasIOL();
    res.json(data);
  } catch (error) {
    console.error('Error en /api/letras:', error.message);
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(3001, () => console.log('✅ Backend (v3) corriendo en http://localhost:3001'));
} else {
  module.exports = app;
}