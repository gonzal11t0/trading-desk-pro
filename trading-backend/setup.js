const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

console.log('🔧 Configurando base de datos...');

// Crear carpeta data
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Conectar a DB
const db = new sqlite3.Database('./data/trading.db');

// Crear tabla
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    plan TEXT DEFAULT 'demo',
    code TEXT UNIQUE,
    active BOOLEAN DEFAULT 1
  )
`, () => {
  console.log('✅ Tabla creada');
  
  // Crear admin
  const email = 'admin@tradingdesk.com';
  const password = 'Admin@Trading2025!';
  const code = 'ADM-' + Date.now().toString().slice(-6);
  
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('❌ Error:', err);
      return;
    }
    
    db.run(
      `INSERT OR IGNORE INTO users (email, password, name, plan, code) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hash, 'Admin', 'enterprise', code],
      function() {
        console.log('\n👤 ADMIN CREADO:');
        console.log(`📧 ${email}`);
        console.log(`🔑 ${password}`);
        console.log(`🔐 ${code}`);
        
        db.close();
        console.log('\n🎉 ¡Listo! Ejecuta: npm run dev');
      }
    );
  });
});