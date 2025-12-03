// server/api-server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Datos para Panel Líder
app.get('/api/leader', (req, res) => {
  const data = [
    { ticker: 'GGAL', variation: 2.15, size: 25 },
    { ticker: 'YPFD', variation: -0.71, size: 20 },
    { ticker: 'PAMP', variation: 1.45, size: 18 },
    { ticker: 'CEPU', variation: 4.77, size: 15 },
    { ticker: 'SUPV', variation: 1.20, size: 12 },
    { ticker: 'BMA', variation: 0.85, size: 10 },
    { ticker: 'LOMA', variation: -1.25, size: 8 },
    { ticker: 'TXAR', variation: 0.30, size: 7 },
    { ticker: 'COME', variation: 2.80, size: 6 },
    { ticker: 'METR', variation: -0.90, size: 5 },
    { ticker: 'CRES', variation: 0.15, size: 4 },
    { ticker: 'EDN', variation: 1.75, size: 4 }
  ];
  
  // Simular variaciones aleatorias
  const randomizedData = data.map(item => ({
    ...item,
    variation: (Math.random() * 10 - 5).toFixed(2)
  }));
  
  res.json(randomizedData);
});

// Datos para CEDEARS
app.get('/api/cedears', (req, res) => {
  const data = [
    { ticker: 'IBIT', variation: -6.92, size: 22 },
    { ticker: 'ETHA', variation: -9.53, size: 20 },
    { ticker: 'SPY', variation: -1.25, size: 18 },
    { ticker: 'MSTR', variation: -2.80, size: 16 },
    { ticker: 'NVDA', variation: -4.15, size: 15 },
    { ticker: 'VIST', variation: -0.85, size: 12 },
    { ticker: 'META', variation: 0.45, size: 10 },
    { ticker: 'MELI', variation: 1.52, size: 8 },
    { ticker: 'PLTR', variation: -3.20, size: 7 },
    { ticker: 'MSFT', variation: 0.25, size: 6 },
    { ticker: 'AAPL', variation: -0.75, size: 5 },
    { ticker: 'GOOGL', variation: -1.15, size: 5 }
  ];
  
  res.json(data);
});

// Datos para Bonos
app.get('/api/bonds', (req, res) => {
  const data = [
    { ticker: 'AL30', variation: -0.51, size: 25 },
    { ticker: 'GD30', variation: -0.55, size: 22 },
    { ticker: 'GD35', variation: -0.60, size: 20 },
    { ticker: 'TX26', variation: -0.45, size: 18 },
    { ticker: 'TXZD5', variation: 0.06, size: 16 },
    { ticker: 'GD38', variation: -0.35, size: 15 },
    { ticker: 'AE38', variation: -0.40, size: 12 },
    { ticker: 'GD41', variation: -0.25, size: 10 },
    { ticker: 'GD46', variation: -0.30, size: 8 },
    { ticker: 'AL35', variation: -0.20, size: 6 },
    { ticker: 'GD29', variation: -0.15, size: 5 },
    { ticker: 'AL41', variation: -0.10, size: 5 }
  ];
  
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});