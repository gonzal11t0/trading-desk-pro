const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default; 
const getLetrasMock = require('./scripts/letrasMock');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'trading-desk-pro-secret-key-2026';
console.log('🚀 Iniciando server.js...');
const yahooFinance = new YahooFinance();

const app = express();
app.use(cors({
  origin: [
    'https://trading-desk-pro.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
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


// ... otros requires


const scrapeLetrasIOL = require('./scripts/get_letras_iol');

// Endpoint para letras
app.get('/api/letras', async (req, res) => {
  try {
    console.log('📡 Solicitando letras...');
    const data = await scrapeLetrasIOL();
    
    if (data.success && data.data && data.data.length > 0) {
      res.json(data);
    } else {
      console.log('⚠️ Falló scraping, usando mock');
      res.json(getLetrasMock());
    }
  } catch (error) {
    console.error('Error en /api/letras:', error.message);
    res.json(getLetrasMock());
  }
});



app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Verificar en hashes hardcodeados (admin)
  const validCredentials = {
    'ZW1haWw9YWRtaW5AdHJhZGluZ2Rlc2suY29tJnBhc3M9QWRtaW5AVHJhZGluZzIwMjUh': {
      role: 'admin',
      name: 'Administrador',
      plan: 'enterprise'
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
      success: true,
      token,
      user: { email, name: userInfo.name, role: userInfo.role, plan: userInfo.plan }
    });
  }

  // 2. Verificar en users.json
  const fs = require('fs');
  const path = require('path');
  const bcrypt = require('bcryptjs');
  const usersFilePath = path.join(__dirname, 'data', 'users.json');

  try {
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = usersData.users.find(u => u.email === email && u.active === true);

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
  } catch (err) {
    console.error('Error leyendo users.json:', err);
  }

  res.status(401).json({ error: 'Credenciales incorrectas' });
});

// ============================================
// ENDPOINTS DE ADMINISTRACIÓN DE USUARIOS
// ============================================

// Obtener todos los usuarios (solo admin)
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const fs = require('fs');
    const path = require('path');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

    const safeUsers = usersData.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      plan: u.plan,
      active: u.active,
      createdAt: u.createdAt
    }));

    res.json({ users: safeUsers });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Crear un nuevo usuario (solo admin)
app.post('/api/admin/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const { email, password, name, role, plan } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcryptjs');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const users = usersData.users;

    if (users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: role || 'client',
      plan: plan || 'basic',
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: users }, null, 2));

    res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        plan: newUser.plan
      }
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar usuario (solo admin)
app.delete('/api/admin/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const userId = parseInt(req.params.id);
    const fs = require('fs');
    const path = require('path');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    let users = usersData.users;

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return res.status(404).json({ error: 'Usuario no encontrado' });

    // No permitir eliminar al último admin
    if (userToDelete.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      return res.status(400).json({ error: 'No puedes eliminar al último administrador' });
    }

    users = users.filter(u => u.id !== userId);
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: users }, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// ============================================
// ENDPOINTS DE ADMINISTRACIÓN DE USUARIOS
// ============================================

// Obtener todos los usuarios (solo admin)
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const fs = require('fs');
    const path = require('path');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    if (!fs.existsSync(usersFilePath)) {
      return res.json({ users: [] });
    }
    
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const safeUsers = usersData.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      plan: u.plan,
      active: u.active,
      createdAt: u.createdAt
    }));

    res.json({ users: safeUsers });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Crear un nuevo usuario (solo admin)
app.post('/api/admin/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const { email, password, name, role, plan } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcryptjs');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Crear archivo si no existe
    let users = [];
    if (fs.existsSync(usersFilePath)) {
      const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      users = usersData.users;
    }
    
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: role || 'client',
      plan: plan || 'basic',
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));

    res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        plan: newUser.plan
      }
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar usuario (solo admin)
app.delete('/api/admin/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });

    const userId = parseInt(req.params.id);
    const fs = require('fs');
    const path = require('path');
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    if (!fs.existsSync(usersFilePath)) {
      return res.status(404).json({ error: 'No hay usuarios' });
    }
    
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    let users = usersData.users;

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return res.status(404).json({ error: 'Usuario no encontrado' });

    // No permitir eliminar al último admin
    if (userToDelete.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      return res.status(400).json({ error: 'No puedes eliminar al último administrador' });
    }

    users = users.filter(u => u.id !== userId);
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});



if (require.main === module) {
  app.listen(3001, () => console.log('✅ Backend (v3) corriendo en http://localhost:3001'));
} else {
  module.exports = app;
}