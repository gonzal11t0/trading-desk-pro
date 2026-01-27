// server.js - Backend simplificado y corregido
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Configuración
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_por_defecto_cambiar';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Inicializar Express
const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de base de datos
const dbPath = process.env.DATABASE_PATH || './database/tradingdesk.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
  } else {
    console.log(`✅ Conectado a SQLite: ${dbPath}`);
  }
});

// Middleware para log de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          message: 'Token inválido o expirado' 
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error de autenticación' 
    });
  }
};

// ==================== RUTAS PÚBLICAS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Trading Desk Pro Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Login principal
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    db.get(
      'SELECT * FROM usuarios WHERE email = ? AND is_active = 1',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Error DB:', err);
          return res.status(500).json({
            success: false,
            message: 'Error del servidor'
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Credenciales incorrectas'
          });
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          return res.status(401).json({
            success: false,
            message: 'Credenciales incorrectas'
          });
        }

        // Actualizar último login
        db.run(
          'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        // Crear token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            plan: user.plan
          },
          JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Responder
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            plan: user.plan,
            codigo_acceso: user.codigo_acceso
          }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login con código (simple para usuarios)
app.post('/api/auth/login-codigo', (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({
      success: false,
      message: 'Código de acceso requerido'
    });
  }

  db.get(
    'SELECT * FROM usuarios WHERE codigo_acceso = ? AND is_active = 1',
    [codigo],
    (err, user) => {
      if (err) {
        console.error('Error DB:', err);
        return res.status(500).json({
          success: false,
          message: 'Error del servidor'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Código de acceso inválido'
        });
      }

      // Actualizar último login
      db.run(
        'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Crear token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          plan: user.plan
        },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          plan: user.plan,
          codigo_acceso: user.codigo_acceso
        }
      });
    }
  );
});

// ==================== RUTAS PROTEGIDAS ====================

// Verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Datos del usuario actual
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, nombre, plan, codigo_acceso, created_at FROM usuarios WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      res.json({
        success: true,
        user
      });
    }
  );
});

// ==================== PROXY PARA APIS ====================

// Proxy para BCRA
app.get('/api/proxy/bcra/*', authenticateToken, async (req, res) => {
  try {
    const endpoint = req.params[0];
    const url = `https://api.bcra.gob.ar/estadisticas/v4.0/${endpoint}`;
    
    console.log(`🌍 Proxy BCRA: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'TradingDeskPro/1.0'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error proxy BCRA:', error.message);
    res.status(500).json({
      error: 'Error obteniendo datos BCRA',
      message: error.message
    });
  }
});

// Proxy para CoinGecko
app.get('/api/proxy/coingecko/*', authenticateToken, async (req, res) => {
  try {
    const endpoint = req.params[0];
    const queryParams = req.query;
    const url = `https://api.coingecko.com/api/v3/${endpoint}`;
    
    console.log(`💰 Proxy CoinGecko: ${endpoint}`);
    
    const response = await axios.get(url, {
      params: queryParams,
      timeout: 10000,
      headers: {
        'User-Agent': 'TradingDeskPro/1.0'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error proxy CoinGecko:', error.message);
    res.status(500).json({
      error: 'Error obteniendo datos cripto',
      message: error.message
    });
  }
});

// Proxy para NewsAPI
app.get('/api/proxy/news', authenticateToken, async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'NewsAPI key no configurada'
      });
    }
    
    const url = `https://newsapi.org/v2/everything`;
    const params = {
      ...req.query,
      apiKey,
      language: 'es',
      sortBy: 'publishedAt',
      pageSize: 20
    };
    
    const response = await axios.get(url, {
      params,
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error proxy NewsAPI:', error.message);
    res.status(500).json({
      error: 'Error obteniendo noticias',
      message: error.message
    });
  }
});

// ==================== RUTAS DE ADMIN ====================

// Listar usuarios
app.get('/api/admin/usuarios', authenticateToken, (req, res) => {
  // Solo admin puede ver esto
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Acceso no autorizado'
    });
  }
  
  db.all(
    `SELECT id, email, nombre, plan, codigo_acceso, 
            created_at, last_login, is_active 
     FROM usuarios ORDER BY created_at DESC`,
    (err, usuarios) => {
      if (err) {
        console.error('Error obteniendo usuarios:', err);
        return res.status(500).json({
          success: false,
          message: 'Error del servidor'
        });
      }
      
      res.json({
        success: true,
        usuarios
      });
    }
  );
});

// Crear usuario
app.post('/api/admin/usuarios', authenticateToken, (req, res) => {
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Acceso no autorizado'
    });
  }
  
  const { email, nombre, plan } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email es requerido'
    });
  }
  
  // Generar código
  const codigoAcceso = 'USR-' + Date.now().toString().slice(-6);
  
  db.run(
    `INSERT INTO usuarios (email, nombre, plan, codigo_acceso, password_hash) 
     VALUES (?, ?, ?, ?, ?)`,
    [email, nombre || email.split('@')[0], plan || 'demo', codigoAcceso, 'CODIGO_ONLY'],
    function(err) {
      if (err) {
        console.error('Error creando usuario:', err);
        return res.status(500).json({
          success: false,
          message: 'Error creando usuario'
        });
      }
      
      res.json({
        success: true,
        message: 'Usuario creado',
        usuario: {
          id: this.lastID,
          email,
          nombre: nombre || email.split('@')[0],
          plan: plan || 'demo',
          codigo_acceso: codigoAcceso
        }
      });
    }
  );
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 BACKEND TRADING DESK PRO`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend permitido: ${FRONTEND_URL}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

// Manejar cierre limpio
process.on('SIGINT', () => {
  console.log('\n🔻 Cerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error cerrando DB:', err.message);
    }
    process.exit(0);
  });
});