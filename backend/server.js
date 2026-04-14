require('dotenv').config();
const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default;
const getLetrasMock = require('./scripts/letrasMock');
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');

const JWT_SECRET = process.env.JWT_SECRET || 'trading-desk-pro-secret-key-2026';
const sql = neon(process.env.POSTGRES_URL);

console.log('🚀 Iniciando server.js con Neon Postgres...');

const app = express();
app.use(cors({
  origin: [
    'https://trading-desk-pro.vercel.app',
    'https://trading-desk-tau.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ============================================
// CREAR TABLA DE USUARIOS SI NO EXISTE
// ============================================
async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'client',
        plan TEXT DEFAULT 'basic',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla "users" creada/verificada');
    
    // Verificar si ya existe el admin, si no, crearlo
    const adminExists = await sql`SELECT * FROM users WHERE email = 'admin@tradingdesk.com'`;
    if (adminExists.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Admin@Trading2025!', 10);
      await sql`
        INSERT INTO users (email, password, name, role, plan, active)
        VALUES ('admin@tradingdesk.com', ${hashedPassword}, 'Administrador', 'admin', 'enterprise', true)
      `;
      console.log('✅ Usuario admin creado en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error creando tabla:', error);
  }
}
createTable();

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const bcrypt = require('bcryptjs');
  
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email} AND active = true`;
    const user = result[0];
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, role: user.role, name: user.name, userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        token,
        user: { email: user.email, name: user.name, role: user.role, plan: user.plan }
      });
    }
    
    // Fallback para admin hardcodeado (por si la tabla falla)
    const validCredentials = {
      'ZW1haWw9YWRtaW5AdHJhZGluZ2Rlc2suY29tJnBhc3M9QWRtaW5AVHJhZGluZzIwMjUh': {
        role: 'admin', name: 'Administrador', plan: 'enterprise'
      }
    };
    const credentialHash = Buffer.from(`email=${email}&pass=${password}`).toString('base64');
    const userInfo = validCredentials[credentialHash];
    
    if (userInfo) {
      const token = jwt.sign(
        { email, role: userInfo.role, name: userInfo.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true, token,
        user: { email, name: userInfo.name, role: userInfo.role, plan: userInfo.plan }
      });
    }
    
    res.status(401).json({ error: 'Credenciales incorrectas' });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINTS DE ADMINISTRACIÓN (con Neon)
// ============================================

// Obtener todos los usuarios
app.get('/api/admin/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const result = await sql`
      SELECT id, email, name, role, plan, active, created_at as "createdAt"
      FROM users ORDER BY id
    `;
    res.json({ users: result });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Crear un nuevo usuario
app.post('/api/admin/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const { email, password, name, role, plan } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await sql`
      INSERT INTO users (email, password, name, role, plan, active, created_at)
      VALUES (${email}, ${hashedPassword}, ${name || email.split('@')[0]}, ${role || 'client'}, ${plan || 'basic'}, true, NOW())
      RETURNING id, email, name, role, plan
    `;
    
    res.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'El email ya existe' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Eliminar usuario
app.delete('/api/admin/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const userId = parseInt(req.params.id);
    await sql`DELETE FROM users WHERE id = ${userId}`;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// ============================================
// TUS ENDPOINTS EXISTENTES (bonos, letras, etc.)
// ============================================
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
    if (data.success && data.data && data.data.length > 0) {
      res.json(data);
    } else {
      res.json(getLetrasMock());
    }
  } catch (error) {
    console.error('Error en /api/letras:', error.message);
    res.json(getLetrasMock());
  }
});

const tickerMap = {
  'YPFD': 'YPF', 'GGAL': 'GGAL', 'PAMP': 'PAMP', 'BMA': 'BMA',
  'TECO2': 'TECO2.BA', 'TGSU2': 'TGSU2.BA', 'ALUA': 'ALUA.BA',
  'CEPU': 'CEPU.BA', 'EDN': 'EDN.BA', 'COME': 'COME.BA'
};

app.get('/api/company/:ticker', async (req, res) => {
  try {
    const ticker = tickerMap[req.params.ticker] || req.params.ticker;
    const quote = await YahooFinance.quote(ticker);
    const endDate = new Date(); const startDate = new Date(); startDate.setMonth(startDate.getMonth() - 3);
    const historical = await YahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1mo' });
    res.json({ ticker: req.params.ticker, nombre: quote.longName || quote.shortName, precio: quote.regularMarketPrice, per: quote.trailingPE, marketCap: quote.marketCap, historical: historical.slice(0, 4) });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================
if (require.main === module) {
  app.listen(3001, () => console.log('✅ Backend con Neon corriendo en http://localhost:3001'));
} else {
  module.exports = app;
}