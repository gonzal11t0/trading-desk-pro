// api/auth.js - VERSIÓN HIPER SIMPLE
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuarios en memoria (más simple)
const users = [
  {
    email: "admin@tradingdesk.com",
    // Hash de "Admin@Trading2025!"
    passwordHash: "$2a$10$RqkPvqQv5f5D5a5Z5a5Z5e5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a",
    name: "Administrador",
    plan: "enterprise",
    code: "ADM-123456"
  },
  {
    email: "gonzalo@admin.com", 
    // Hash de tu contraseña actual
    passwordHash: "$2a$10$RqkPvqQv5f5D5a5Z5a5Z5e5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a",
    name: "Gonzalo",
    plan: "enterprise",
    code: "GON-789012"
  }
];

// Función para comparar contraseñas (simplificada)
async function comparePassword(password, hash) {
  // Si el hash es el placeholder, usa comparación directa
  if (hash.includes('RqkPvqQv5f5D5a5Z5a5Z5e5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a5Z5a')) {
    // Solo para desarrollo - en producción usar bcrypt real
    if (password === "Admin@Trading2025!" && email === "admin@tradingdesk.com") return true;
    if (password === "tu_contraseña_aqui" && email === "gonzalo@admin.com") return true;
    return false;
  }
  return await bcrypt.compare(password, hash);
}

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  // Para preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  
  try {
    const { email, password, code } = req.body;
    
    let user = null;
    
    // Buscar usuario
    if (email && password) {
      user = users.find(u => u.email === email);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Verificar contraseña (versión simplificada)
      let validPassword = false;
      
      if (email === "admin@tradingdesk.com" && password === "Admin@Trading2025!") {
        validPassword = true;
      } else if (email === "gonzalo@admin.com" && password === "tu_contraseña_aqui") {
        validPassword = true;
      }
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
    } else if (code) {
      user = users.find(u => u.code === code);
      
      if (!user) {
        return res.status(401).json({ error: 'Código inválido' });
      }
    } else {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    // Crear token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        plan: user.plan,
        code: user.code
      },
      process.env.JWT_SECRET || 'secret-temporal-123',
      { expiresIn: '7d' }
    );
    
    // Responder
    return res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        plan: user.plan,
        code: user.code
      }
    });
    
  } catch (error) {
    console.error('Error en auth:', error);
    return res.status(500).json({ 
      error: 'Error interno',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};