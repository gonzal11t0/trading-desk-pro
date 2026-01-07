#!/usr/bin/env node

// scripts/manage-users.js
// Este es un script de Node.js, NO se ejecuta en el navegador
// Por lo tanto, no aplican las reglas de ESLint del frontend

// Agregar esto al inicio para indicar que es Node.js
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const CryptoJS = require('crypto-js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_FILE = path.join(__dirname, '..', '.env');
const ENV_EXAMPLE_FILE = path.join(__dirname, '..', '.env.example');

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Función para leer el archivo .env
function readEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    console.log(`${colors.red}❌ No se encontró el archivo .env${colors.reset}`);
    console.log(`${colors.yellow}Crea el archivo .env copiando .env.example${colors.reset}`);
    process.exit(1);
  }
  
  return fs.readFileSync(ENV_FILE, 'utf8');
}

// Función para escribir en el archivo .env
function writeEnvFile(content) {
  fs.writeFileSync(ENV_FILE, content);
  console.log(`${colors.green}✅ Archivo .env actualizado${colors.reset}`);
}

// Función para extraer usuarios del .env
function extractUsersFromEnv(content) {
  const users = {};
  const lines = content.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    
    // Buscar usuarios (VITE_USER_X=email:password)
    const userMatch = line.match(/^VITE_USER_(\d+)=(.+)$/);
    if (userMatch) {
      const [, index, value] = userMatch;
      if (value.includes(':')) {
        const [email, password] = value.split(':');
        users[index] = { email, password, line };
      } else if (value.trim() !== '') {
        users[index] = { email: value, password: null, line };
      }
    }
    
    // Buscar admin
    if (line.startsWith('VITE_ADMIN_USER=')) {
      const email = line.split('=')[1];
      const passLine = lines.find(l => l.startsWith('VITE_ADMIN_PASS='));
      const password = passLine ? passLine.split('=')[1] : null;
      users['admin'] = { email, password, line, isAdmin: true };
    }
  });
  
  return users;
}

// Función para generar contraseña segura
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Asegurar al menos un carácter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 23)];
  
  // Completar con caracteres aleatorios
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mezclar
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return password;
}

// Comando: Listar usuarios
function listUsers() {
  const content = readEnvFile();
  const users = extractUsersFromEnv(content);
  
  console.log(`\n${colors.bright}${colors.cyan}👥 USUARIOS REGISTRADOS${colors.reset}`);
  console.log(`${'='.repeat(50)}`);
  
  // Mostrar admin
  if (users.admin) {
    console.log(`\n${colors.bright}👑 ADMINISTRADOR${colors.reset}`);
    console.log(`  Email: ${colors.green}${users.admin.email}${colors.reset}`);
    console.log(`  Contraseña: ${users.admin.password ? '🔐 Configurada' : '❌ No configurada'}`);
  }
  
  // Mostrar usuarios
  const clientUsers = Object.entries(users)
    .filter(([key]) => key !== 'admin')
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  if (clientUsers.length > 0) {
    console.log(`\n${colors.bright}👤 CLIENTES${colors.reset}`);
    clientUsers.forEach(([index, user]) => {
      console.log(`\n  ${colors.yellow}[Usuario ${index}]${colors.reset}`);
      console.log(`    Email: ${colors.blue}${user.email}${colors.reset}`);
      console.log(`    Contraseña: ${user.password ? '🔐 Configurada' : '❌ Sin contraseña'}`);
      if (user.password) {
        console.log(`    Contraseña: ${colors.green}${user.password}${colors.reset}`);
      }
    });
  } else {
    console.log(`\n${colors.yellow}⚠️ No hay clientes registrados${colors.reset}`);
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`${colors.cyan}Total: ${clientUsers.length} cliente(s)${colors.reset}`);
}

// Comando: Agregar usuario
function addUser() {
  rl.question(`${colors.cyan}📧 Email del nuevo usuario: ${colors.reset}`, (email) => {
    if (!email.includes('@')) {
      console.log(`${colors.red}❌ Email inválido${colors.reset}`);
      rl.close();
      return;
    }
    
    rl.question(`${colors.cyan}¿Generar contraseña automáticamente? (s/n): ${colors.reset}`, (generate) => {
      let password;
      
      if (generate.toLowerCase() === 's') {
        password = generatePassword();
        console.log(`${colors.green}✅ Contraseña generada: ${colors.bright}${password}${colors.reset}`);
      } else {
        rl.question(`${colors.cyan}🔑 Contraseña personalizada: ${colors.reset}`, (customPass) => {
          password = customPass;
          processAddUser(email, password);
        });
        return;
      }
      
      processAddUser(email, password);
    });
  });
}

function processAddUser(email, password) {
  const content = readEnvFile();
  const users = extractUsersFromEnv(content);
  
  // Buscar el próximo índice disponible
  let nextIndex = 1;
  while (users[nextIndex]) {
    nextIndex++;
  }
  
  if (nextIndex > 10) {
    console.log(`${colors.red}❌ Límite de 10 clientes alcanzado${colors.reset}`);
    rl.close();
    return;
  }
  
  // Actualizar contenido
  const lines = content.split('\n');
  const newLine = `VITE_USER_${nextIndex}=${email}:${password}`;
  
  // Agregar al final del archivo
  lines.push(newLine);
  const newContent = lines.join('\n');
  
  writeEnvFile(newContent);
  
  // Mostrar mensaje para WhatsApp
  console.log(`\n${colors.bright}${colors.green}📋 MENSAJE PARA WHATSAPP:${colors.reset}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`🔐 *CONTRASEÑA PARA TRADING DESK PRO* 🔐\n`);
  console.log(`👤 *Cliente:* ${email}`);
  console.log(`🔑 *Contraseña:* \`${password}\``);
  console.log(`\n📋 *Para copiar:* ${password}`);
  console.log(`${'='.repeat(50)}`);
  
  rl.close();
}

// Comando: Eliminar usuario
function deleteUser() {
  const content = readEnvFile();
  const users = extractUsersFromEnv(content);
  
  const clientUsers = Object.entries(users)
    .filter(([key]) => key !== 'admin' && key !== 'admin_pass')
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  if (clientUsers.length === 0) {
    console.log(`${colors.yellow}⚠️ No hay clientes para eliminar${colors.reset}`);
    rl.close();
    return;
  }
  
  console.log(`\n${colors.bright}${colors.yellow}🗑️  SELECCIONA USUARIO A ELIMINAR:${colors.reset}`);
  clientUsers.forEach(([index, user]) => {
    console.log(`  ${index}. ${user.email}`);
  });
  
  rl.question(`${colors.cyan}\nNúmero del usuario a eliminar: ${colors.reset}`, (index) => {
    if (!users[index]) {
      console.log(`${colors.red}❌ Usuario no encontrado${colors.reset}`);
      rl.close();
      return;
    }
    
    const email = users[index].email;
    
    rl.question(`${colors.red}¿Estás seguro de eliminar a ${email}? (s/n): ${colors.reset}`, (confirm) => {
      if (confirm.toLowerCase() === 's') {
        const lines = content.split('\n');
        const newLines = lines.filter(line => !line.startsWith(`VITE_USER_${index}=`));
        writeEnvFile(newLines.join('\n'));
        console.log(`${colors.green}✅ Usuario eliminado${colors.reset}`);
      } else {
        console.log(`${colors.yellow}✅ Operación cancelada${colors.reset}`);
      }
      rl.close();
    });
  });
}

// Comando: Resetear contraseña
function resetPassword() {
  const content = readEnvFile();
  const users = extractUsersFromEnv(content);
  
  const allUsers = Object.entries(users)
    .filter(([key]) => key !== 'admin_pass')
    .sort(([key]) => key === 'admin' ? 0 : parseInt(key));
  
  console.log(`\n${colors.bright}${colors.cyan}🔄 SELECCIONA USUARIO PARA RESETEAR:${colors.reset}`);
  allUsers.forEach(([key, user]) => {
    const label = key === 'admin' ? '👑 Admin' : `👤 Cliente ${key}`;
    console.log(`  ${key.padEnd(6)} ${label}: ${user.email}`);
  });
  
  rl.question(`${colors.cyan}\nID del usuario (ej: "admin" o "1"): ${colors.reset}`, (id) => {
    const user = users[id];
    if (!user) {
      console.log(`${colors.red}❌ Usuario no encontrado${colors.reset}`);
      rl.close();
      return;
    }
    
    const newPassword = generatePassword();
    
    rl.question(`${colors.yellow}¿Generar nueva contraseña para ${user.email}? (s/n): ${colors.reset}`, (confirm) => {
      if (confirm.toLowerCase() === 's') {
        let newContent;
        
        if (id === 'admin') {
          // Actualizar contraseña de admin
          const lines = content.split('\n');
          newContent = lines.map(line => {
            if (line.startsWith('VITE_ADMIN_PASS=')) {
              return `VITE_ADMIN_PASS=${newPassword}`;
            }
            return line;
          }).join('\n');
        } else {
          // Actualizar contraseña de cliente
          const lines = content.split('\n');
          newContent = lines.map(line => {
            if (line.startsWith(`VITE_USER_${id}=`)) {
              return `VITE_USER_${id}=${user.email}:${newPassword}`;
            }
            return line;
          }).join('\n');
        }
        
        writeEnvFile(newContent);
        
        console.log(`\n${colors.bright}${colors.green}✅ CONTRASEÑA ACTUALIZADA${colors.reset}`);
        console.log(`${'='.repeat(50)}`);
        console.log(`Usuario: ${user.email}`);
        console.log(`Nueva contraseña: ${colors.bright}${newPassword}${colors.reset}`);
        console.log(`${'='.repeat(50)}`);
      } else {
        console.log(`${colors.yellow}✅ Operación cancelada${colors.reset}`);
      }
      rl.close();
    });
  });
}

// Mostrar ayuda
function showHelp() {
  console.log(`
${colors.bright}${colors.cyan}🔐 GESTIÓN DE USUARIOS - TRADING DESK PRO${colors.reset}
${'='.repeat(50)}

${colors.bright}Uso:${colors.reset} node scripts/manage-users.js [comando]

${colors.bright}Comandos disponibles:${colors.reset}
  ${colors.green}list${colors.reset}      - Listar todos los usuarios
  ${colors.green}add${colors.reset}       - Agregar nuevo usuario
  ${colors.green}delete${colors.reset}    - Eliminar usuario existente
  ${colors.green}reset${colors.reset}     - Resetear contraseña de usuario
  ${colors.green}help${colors.reset}      - Mostrar esta ayuda

${colors.bright}Ejemplos:${colors.reset}
  node scripts/manage-users.js list
  node scripts/manage-users.js add
  node scripts/manage-users.js delete

${colors.yellow}⚠️  Importante:${colors.reset}
- El archivo .env NO debe subirse a Git
- Mantén backup seguro de las contraseñas
- Usa contraseñas seguras y únicas
  `);
}

// Procesar comando
const command = process.argv[2];

switch (command) {
  case 'list':
    listUsers();
    break;
  case 'add':
    addUser();
    break;
  case 'delete':
    deleteUser();
    break;
  case 'reset':
    resetPassword();
    break;
  case 'help':
  default:
    showHelp();
    break;
}

// Si no hay comando, mostrar ayuda
if (!command) {
  showHelp();
  rl.close();
}