const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default; 

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
    
    const quote = await yahooFinance.quote(ticker);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    
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

const { exec } = require('child_process');
const path = require('path');

app.get('/api/bonos', (req, res) => {
  const scriptPath = path.join(__dirname, 'scripts', 'get_bonds.py');
  
exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error ejecutando script:', error);
      return res.status(500).json({ error: stderr });
    }
    
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'Error parseando JSON' });
    }
  });
});
app.get('/api/letras', (req, res) => {
  const scriptPath = path.join(__dirname, 'scripts', 'get_letras.py');
  
  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error ejecutando script:', error);
      return res.status(500).json({ error: stderr });
    }
    
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'Error parseando JSON' });
    }
  });
});

app.get('/api/test', (req, res) => {
  const scriptPath = path.join(__dirname, 'scripts', 'test.py');
  
  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'Error parseando JSON', stdout });
    }
  });
});
module.exports = app;