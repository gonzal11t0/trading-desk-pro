// auth.js - HIPER SIMPLE
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  
  try {
    const { email, password, code } = req.body;
    
    // CREDENCIALES VÁLIDAS
    const validCredentials = [
      {
        email: 'admin@tradingdesk.com',
        password: 'Admin@Trading2025!',
        name: 'Administrador',
        plan: 'enterprise',
        code: 'ADM-123456'
      },
      {
        email: 'gonzalo@admin.com',
        password: 'tu_contraseña_aqui', // CAMBIA ESTO
        name: 'Gonzalo',
        plan: 'enterprise',
        code: 'GON-789012'
      }
    ];
    
    let user = null;
    
    if (email && password) {
      user = validCredentials.find(u => u.email === email && u.password === password);
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    } 
    else if (code) {
      user = validCredentials.find(u => u.code === code);
      if (!user) return res.status(401).json({ error: 'Código inválido' });
    }
    else {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    // TOKEN
    const token = jwt.sign(
      { email: user.email, name: user.name, plan: user.plan },
      process.env.JWT_SECRET || 'default-secret-123',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name, plan: user.plan, code: user.code }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};