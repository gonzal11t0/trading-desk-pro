require('dotenv').config();
const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');

// Mantener compatibilidad con el despliegue existente, que todavía no tiene
// JWT_SECRET configurado. La variable de entorno sigue teniendo prioridad.
const LEGACY_JWT_SECRET = 'trading-desk-pro-secret-key-2026';
const JWT_SECRET = process.env.JWT_SECRET || LEGACY_JWT_SECRET;
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET no configurado: usando compatibilidad temporal. Configuralo en Vercel antes de activar REQUIRE_JWT_SECRET.');
  if (process.env.REQUIRE_JWT_SECRET === 'true') throw new Error('Falta la variable de entorno JWT_SECRET');
}
if (!process.env.POSTGRES_URL) throw new Error('Falta la variable de entorno POSTGRES_URL');
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
app.use(express.json({ limit: '1mb' }));

const getAdminFromRequest = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const error = new Error('Token no proporcionado');
    error.status = 401;
    throw error;
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== 'admin') {
    const error = new Error('Acceso denegado');
    error.status = 403;
    throw error;
  }
  return decoded;
};

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

    await sql`
      CREATE TABLE IF NOT EXISTS balances (
        ticker TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        source_filename TEXT,
        source_url TEXT,
        updated_by TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla "balances" creada/verificada');

    await sql`
      CREATE TABLE IF NOT EXISTS balance_versions (
        id BIGSERIAL PRIMARY KEY,
        ticker TEXT NOT NULL,
        data JSONB NOT NULL,
        source_filename TEXT,
        source_url TEXT,
        published_by TEXT NOT NULL,
        published_at TIMESTAMP DEFAULT NOW(),
        active BOOLEAN DEFAULT true
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS balance_versions_ticker_idx ON balance_versions (ticker, published_at DESC)`;
    await sql`
      INSERT INTO balance_versions (ticker, data, source_filename, source_url, published_by, published_at, active)
      SELECT b.ticker, b.data, b.source_filename, b.source_url, b.updated_by, b.updated_at, true
      FROM balances b
      WHERE NOT EXISTS (SELECT 1 FROM balance_versions v WHERE v.ticker = b.ticker)
    `;
    console.log('✅ Historial de balances creado/verificado');
    
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
        user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan }
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

// Modificar nombre, rol, plan, estado y opcionalmente contraseña
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const admin = getAdminFromRequest(req);
    const userId = Number.parseInt(req.params.id, 10);
    const { name, role, plan, active, password } = req.body || {};
    const allowedRoles = ['admin', 'client'];
    const allowedPlans = ['basic', 'pro', 'enterprise'];

    if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Usuario inválido' });
    if (!allowedRoles.includes(role) || !allowedPlans.includes(plan)) {
      return res.status(400).json({ error: 'Rol o plan inválido' });
    }

    const existing = await sql`SELECT id, email, role, active FROM users WHERE id = ${userId}`;
    const user = existing[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.id === admin.userId && (role !== 'admin' || active === false)) {
      return res.status(400).json({ error: 'No podés quitarte tu propio acceso de administrador' });
    }
    if (user.role === 'admin' && (role !== 'admin' || active === false)) {
      const admins = await sql`SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin' AND active = true`;
      if (admins[0].count <= 1) return res.status(400).json({ error: 'Debe quedar al menos un administrador activo' });
    }

    let passwordHash = null;
    if (password) {
      if (String(password).length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
      passwordHash = await require('bcryptjs').hash(String(password), 10);
    }

    const result = passwordHash
      ? await sql`
          UPDATE users SET name = ${String(name || '').trim()}, role = ${role}, plan = ${plan},
            active = ${active !== false}, password = ${passwordHash}
          WHERE id = ${userId}
          RETURNING id, email, name, role, plan, active, created_at as "createdAt"
        `
      : await sql`
          UPDATE users SET name = ${String(name || '').trim()}, role = ${role}, plan = ${plan},
            active = ${active !== false}
          WHERE id = ${userId}
          RETURNING id, email, name, role, plan, active, created_at as "createdAt"
        `;
    res.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Error modificando usuario:', error);
    res.status(error.status || 500).json({ error: error.message || 'No fue posible modificar el usuario' });
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
    if (decoded.userId === userId) return res.status(400).json({ error: 'No podés eliminarte a vos mismo' });
    const target = await sql`SELECT role, active FROM users WHERE id = ${userId}`;
    if (!target[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (target[0].role === 'admin' && target[0].active) {
      const admins = await sql`SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin' AND active = true`;
      if (admins[0].count <= 1) return res.status(400).json({ error: 'No se puede eliminar el último administrador activo' });
    }
    await sql`DELETE FROM users WHERE id = ${userId}`;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// ============================================
// BALANCES PUBLICADOS Y CARGA ADMINISTRATIVA
// ============================================
app.get('/api/balances', async (_req, res) => {
  try {
    const result = await sql`
      SELECT ticker, data, source_filename as "sourceFilename",
             source_url as "sourceUrl", updated_at as "updatedAt"
      FROM balances ORDER BY ticker
    `;
    const versions = await sql`
      SELECT ticker, data, source_filename as "sourceFilename", source_url as "sourceUrl",
             published_by as "publishedBy", published_at as "publishedAt", id
      FROM balance_versions ORDER BY published_at ASC
    `;
    const historyByTicker = new Map();
    for (const version of versions) {
      const history = historyByTicker.get(version.ticker) || [];
      history.push({ ...version.data, versionId: version.id, fuenteArchivo: version.sourceFilename,
        fuenteUrl: version.sourceUrl, publicadoPor: version.publishedBy, publicadoEn: version.publishedAt });
      historyByTicker.set(version.ticker, history);
    }
    res.json({
      empresas: result.map(row => ({
        ...row.data,
        ticker: row.ticker,
        fuenteArchivo: row.sourceFilename,
        fuenteUrl: row.sourceUrl,
        actualizadoEn: row.updatedAt,
        historial: historyByTicker.get(row.ticker) || []
      })),
      ultima_actualizacion: result.reduce(
        (latest, row) => !latest || row.updatedAt > latest ? row.updatedAt : latest,
        null
      )
    });
  } catch (error) {
    console.error('Error obteniendo balances:', error);
    res.status(500).json({ error: 'No fue posible obtener los balances publicados' });
  }
});

app.post('/api/admin/balances', async (req, res) => {
  try {
    const admin = getAdminFromRequest(req);
    const { balance, sourceFilename, sourceUrl } = req.body || {};
    const ticker = String(balance?.ticker || '').trim().toUpperCase();
    const requiredText = ['nombre', 'ultimoBalance', 'periodo', 'moneda'];
    const isBank = balance?.sector === 'bank' || ['BMA', 'GGAL'].includes(ticker);
    const requiredNumbers = isBank
      ? ['ingresos', 'patrimonio', 'resultadoNeto']
      : ['ingresos', 'ebitda', 'deuda', 'patrimonio'];

    if (!/^[A-Z0-9.]{2,10}$/.test(ticker)) {
      return res.status(400).json({ error: 'Ticker inválido' });
    }
    if (requiredText.some(field => !String(balance?.[field] || '').trim())) {
      return res.status(400).json({ error: 'Completá empresa, balance, período y moneda' });
    }
    if (requiredNumbers.some(field => !Number.isFinite(Number(balance?.[field])))) {
      return res.status(400).json({ error: isBank
        ? 'Ingresos operativos, resultado neto y patrimonio deben ser números'
        : 'Ingresos, EBITDA, deuda y patrimonio deben ser números' });
    }

    const numericFields = [
      'precio', 'ingresos', 'varIngresos', 'ebitda', 'varEbitda', 'deuda',
      'varDeuda', 'patrimonio', 'resultadoNeto', 'per', 'varPer', 'roe',
      'varRoe', 'deudaEbitda'
    ];
    const cleanBalance = { ...balance, ticker };
    for (const field of numericFields) {
      if (cleanBalance[field] === '' || cleanBalance[field] === null || cleanBalance[field] === undefined) {
        cleanBalance[field] = null;
        continue;
      }
      const value = Number(cleanBalance[field]);
      cleanBalance[field] = Number.isFinite(value) ? value : null;
    }
    cleanBalance.sector = isBank ? 'bank' : 'industrial';
    if (isBank) {
      cleanBalance.ebitda = null;
      cleanBalance.varEbitda = null;
      cleanBalance.deuda = null;
      cleanBalance.varDeuda = null;
    }
    cleanBalance.deudaEbitda = Number.isFinite(cleanBalance.deuda) && Number.isFinite(cleanBalance.ebitda) && cleanBalance.ebitda !== 0
      ? Number((cleanBalance.deuda / cleanBalance.ebitda).toFixed(2))
      : null;
    cleanBalance.roe = Number.isFinite(cleanBalance.resultadoNeto) && cleanBalance.patrimonio !== 0
      ? Number(((cleanBalance.resultadoNeto / cleanBalance.patrimonio) * 100).toFixed(2))
      : cleanBalance.roe;
    cleanBalance.recomendacion = 'SIN RECOMENDACIÓN';
    cleanBalance.analisis = String(cleanBalance.analisis || '').trim()
      || 'Datos publicados para análisis. Revisar el documento fuente y su unidad de medida.';

    await sql`UPDATE balance_versions SET active = false WHERE ticker = ${ticker} AND active = true`;
    await sql`
      INSERT INTO balance_versions (ticker, data, source_filename, source_url, published_by, published_at, active)
      VALUES (${ticker}, ${JSON.stringify(cleanBalance)}::jsonb, ${sourceFilename || null},
              ${sourceUrl || null}, ${admin.email}, NOW(), true)
    `;
    const result = await sql`
      INSERT INTO balances (ticker, data, source_filename, source_url, updated_by, updated_at)
      VALUES (${ticker}, ${JSON.stringify(cleanBalance)}::jsonb,
              ${sourceFilename || null}, ${sourceUrl || null}, ${admin.email}, NOW())
      ON CONFLICT (ticker) DO UPDATE SET
        data = EXCLUDED.data,
        source_filename = EXCLUDED.source_filename,
        source_url = EXCLUDED.source_url,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING ticker, data, updated_at as "updatedAt"
    `;
    res.json({ success: true, balance: result[0] });
  } catch (error) {
    console.error('Error guardando balance:', error);
    res.status(error.status || 401).json({ error: error.message || 'No fue posible guardar el balance' });
  }
});

app.get('/api/admin/balances', async (req, res) => {
  try {
    getAdminFromRequest(req);
    const versions = await sql`
      SELECT id, ticker, data, source_filename as "sourceFilename", source_url as "sourceUrl",
             published_by as "publishedBy", published_at as "publishedAt", active
      FROM balance_versions ORDER BY ticker, published_at DESC
    `;
    res.json({ versions });
  } catch (error) {
    res.status(error.status || 401).json({ error: error.message || 'No fue posible listar los balances' });
  }
});

app.post('/api/admin/balances/:ticker/versions/:id/restore', async (req, res) => {
  try {
    const admin = getAdminFromRequest(req);
    const ticker = String(req.params.ticker || '').toUpperCase();
    const versionId = Number.parseInt(req.params.id, 10);
    const rows = await sql`SELECT * FROM balance_versions WHERE id = ${versionId} AND ticker = ${ticker}`;
    if (!rows[0]) return res.status(404).json({ error: 'Versión no encontrada' });
    const version = rows[0];
    await sql`UPDATE balance_versions SET active = false WHERE ticker = ${ticker}`;
    await sql`UPDATE balance_versions SET active = true WHERE id = ${versionId}`;
    await sql`
      INSERT INTO balances (ticker, data, source_filename, source_url, updated_by, updated_at)
      VALUES (${ticker}, ${JSON.stringify(version.data)}::jsonb, ${version.source_filename},
              ${version.source_url}, ${admin.email}, NOW())
      ON CONFLICT (ticker) DO UPDATE SET data = EXCLUDED.data, source_filename = EXCLUDED.source_filename,
        source_url = EXCLUDED.source_url, updated_by = EXCLUDED.updated_by, updated_at = NOW()
    `;
    res.json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'No fue posible restaurar la versión' });
  }
});

app.delete('/api/admin/balances/:ticker', async (req, res) => {
  try {
    getAdminFromRequest(req);
    const ticker = String(req.params.ticker || '').toUpperCase();
    await sql`DELETE FROM balances WHERE ticker = ${ticker}`;
    await sql`UPDATE balance_versions SET active = false WHERE ticker = ${ticker}`;
    res.json({ success: true, recoverable: true });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'No fue posible retirar el balance' });
  }
});

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  databaseConfigured: Boolean(process.env.POSTGRES_URL),
  jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
  strictJwtMode: process.env.REQUIRE_JWT_SECRET === 'true'
}));

// ============================================
// TUS ENDPOINTS EXISTENTES (bonos, letras, etc.)
// ============================================
const scrapeBonosIOL = require('./scripts/get_bonos_iol');
app.get('/api/bonos', async (req, res) => {
  try {
    const data = await scrapeBonosIOL();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      return res.status(503).json({ error: data.error || 'La fuente de bonos no devolvió datos', fuente: data.fuente || 'IOL' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error en /api/bonos:', error.message);
    res.status(503).json({ error: 'No fue posible obtener bonos reales', fuente: 'IOL' });
  }
});

const scrapeLetrasIOL = require('./scripts/get_letras_iol');
app.get('/api/letras', async (req, res) => {
  try {
    const data = await scrapeLetrasIOL();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      return res.status(503).json({ error: data.error || 'La fuente de letras no devolvió datos', fuente: data.fuente || 'IOL' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error en /api/letras:', error.message);
    res.status(503).json({ error: 'No fue posible obtener letras reales', fuente: 'IOL' });
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
    const quote = await yahooFinance.quote(ticker);
    const endDate = new Date(); const startDate = new Date(); startDate.setMonth(startDate.getMonth() - 3);
    const historical = await yahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1mo' });
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
