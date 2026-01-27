// api/lib/database.js - SQLite para Vercel
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ruta para la base de datos en Vercel
const dbPath = '/tmp/tradingdesk.db'; // Vercel usa /tmp para archivos temporales

// Inicializar base de datos
function initDatabase() {
  const db = new Database(dbPath);
  
  // Crear tablas si no existen
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      plan TEXT DEFAULT 'demo',
      access_code TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    );
    
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service TEXT,
      encrypted_key TEXT,
      last_used DATETIME
    );
  `);
  
  // Crear usuario admin por defecto
  const adminEmail = 'admin@tradingdesk.com';
  const adminPassword = 'Admin@Trading2025!';
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  
  if (!adminExists) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    const accessCode = 'ADM-' + Date.now().toString().slice(-6);
    
    db.prepare(`
      INSERT INTO users (email, password_hash, name, plan, access_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(adminEmail, passwordHash, 'Administrador', 'enterprise', accessCode);
    
    console.log('👑 Usuario admin creado:', {
      email: adminEmail,
      password: adminPassword,
      access_code: accessCode
    });
  }
  
  // Insertar API keys por defecto
  const keys = [
    ['NEWS_API', process.env.NEWS_API_KEY || ''],
    ['ALPHA_VANTAGE', process.env.ALPHA_VANTAGE_KEY || ''],
    ['SCRAPERAPI', process.env.SCRAPERAPI_KEY || '']
  ];
  
  keys.forEach(([service, key]) => {
    if (key) {
      db.prepare(`
        INSERT OR IGNORE INTO api_keys (service, encrypted_key)
        VALUES (?, ?)
      `).run(service, key);
    }
  });
  
  return db;
}

// Singleton de la base de datos
let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = initDatabase();
  }
  return dbInstance;
}

module.exports = { getDatabase };