/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Datos mock (podrían moverse a un archivo separado)
const MOCK_DATA = {
  leader: [
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
  ],
  
  cedears: [
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
  ],
  
  bonds: [
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
  ]
};

// Helper para simular variaciones (opcional, con semilla para consistencia)
const simulateVariations = (data, seed = Date.now()) => {
  const random = (index) => {
    // Usar semilla + índice para variaciones reproducibles
    const pseudoRandom = Math.sin(seed + index) * 10000;
    return (pseudoRandom - Math.floor(pseudoRandom)) * 10 - 5;
  };
  
  return data.map((item, index) => ({
    ...item,
    variation: parseFloat((item.variation + random(index)).toFixed(2))
  }));
};

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message, err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

app.get('/api/leader', (req, res, next) => {
  try {
    const shouldRandomize = req.query.randomize === 'true';
    let data = MOCK_DATA.leader;
    
    if (shouldRandomize) {
      data = simulateVariations(data, Date.now());
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/cedears', (req, res, next) => {
  try {
    res.json(MOCK_DATA.cedears);
  } catch (error) {
    next(error);
  }
});

app.get('/api/bonds', (req, res, next) => {
  try {
    res.json(MOCK_DATA.bonds);
  } catch (error) {
    next(error);
  }
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Middleware de errores
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`CORS allowed origins: ${NODE_ENV === 'development' ? 'http://localhost:5173' : 'From env'}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;