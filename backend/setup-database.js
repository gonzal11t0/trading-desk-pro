// setup-database.js - Versión simplificada y corregida
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('🚀 Iniciando configuración de base de datos...');

// Ruta de la base de datos (usa variable de entorno)
const dbPath = process.env.DATABASE_PATH || './database/tradingdesk.db';
const dbDir = path.dirname(dbPath);

// Crear directorio si no existe
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Directorio creado: ${dbDir}`);
}

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
    process.exit(1);
  }
  console.log(`✅ Conectado a la base de datos: ${dbPath}`);
  createTables();
});

// Función para ejecutar SQL y manejar errores
function runSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

// Función para obtener datos
function getSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function createTables() {
  try {
    console.log('📊 Creando tablas...');
    
    // Tabla de usuarios
    await runSQL(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        nombre TEXT,
        plan TEXT DEFAULT 'demo',
        codigo_acceso TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1
      )
    `);
    console.log('✅ Tabla "usuarios" creada');
    
    // Tabla de configuraciones
    await runSQL(`
      CREATE TABLE IF NOT EXISTS configuraciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clave TEXT UNIQUE NOT NULL,
        valor TEXT,
        descripcion TEXT
      )
    `);
    console.log('✅ Tabla "configuraciones" creada');
    
    // Crear usuario admin
    await createAdminUser();
    
    // Insertar configuraciones por defecto
    await insertDefaultConfig();
    
    console.log('\n🎉 ¡BASE DE DATOS CONFIGURADA EXITOSAMENTE!');
    console.log('===========================================');
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  } finally {
    // Cerrar conexión
    db.close((err) => {
      if (err) {
        console.error('Error cerrando DB:', err.message);
      } else {
        console.log('🔒 Conexión a base de datos cerrada');
      }
    });
  }
}

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@tradingdesk.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@Trading2025!';
    
    // Verificar si el usuario ya existe
    const existingUser = await getSQL('SELECT id FROM usuarios WHERE email = ?', [email]);
    
    if (existingUser) {
      console.log(`⚠️ Usuario admin ya existe: ${email}`);
      return;
    }
    
    // Generar código de acceso
    const codigoAcceso = 'ADM-' + Date.now().toString().slice(-6);
    
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Insertar usuario admin
    await runSQL(
      `INSERT INTO usuarios (email, password_hash, nombre, plan, codigo_acceso) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, passwordHash, 'Administrador', 'enterprise', codigoAcceso]
    );
    
    console.log('👑 USUARIO ADMIN CREADO:');
    console.log('=======================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`🔐 Código acceso: ${codigoAcceso}`);
    console.log(`💼 Plan: enterprise`);
    
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
  }
}

async function insertDefaultConfig() {
  try {
    const configs = [
      ['MAX_USERS', '100', 'Número máximo de usuarios'],
      ['ALLOW_REGISTRATION', 'false', 'Permitir registro público'],
      ['DEFAULT_PLAN', 'demo', 'Plan por defecto'],
      ['SESSION_TIMEOUT', '86400', 'Timeout de sesión en segundos (24h)'],
      ['API_RATE_LIMIT', '1000', 'Límite de requests por hora'],
      ['DEMO_EXPIRY_DAYS', '7', 'Días de demo gratis']
    ];
    
    for (const [clave, valor, descripcion] of configs) {
      await runSQL(
        `INSERT OR IGNORE INTO configuraciones (clave, valor, descripcion) VALUES (?, ?, ?)`,
        [clave, valor, descripcion]
      );
    }
    
    console.log('⚙️ Configuraciones por defecto insertadas');
    
  } catch (error) {
    console.error('❌ Error insertando configuraciones:', error);
  }
}

// Manejar cierre del proceso
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error cerrando DB:', err.message);
    }
    process.exit(0);
  });
});