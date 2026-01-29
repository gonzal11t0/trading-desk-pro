// api/auth.js - VERSIÓN QUE SÍ FUNCIONA
export default function handler(req, res) {
  console.log('🔐 Auth API called:', req.method, new Date().toISOString());
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo POST para login
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido. Usa POST.',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    const { email, password } = req.body;
    console.log('📧 Login attempt for:', email);
    
    // Usuarios válidos
    const users = {
      'admin@tradingdesk.com': 'Admin@Trading2025!',
      'gonzalaz@live.com.ar': 'M+qFS3!Yt2FM',
      'demo@tradingdesk.com': 'Demo123!'
    };
    
    if (users[email] && users[email] === password) {
      console.log('✅ Login successful!');
      
      const userData = {
        email: email,
        name: email === 'admin@tradingdesk.com' ? 'Administrador' : 
              email === 'gonzalaz@live.com.ar' ? 'Gonzalo' : 'Demo User',
        role: 'admin',
        plan: 'enterprise'
      };
      
      return res.status(200).json({
        success: true,
        token: 'tdp_token_' + Date.now(),
        user: userData,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    console.error('🚨 Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}