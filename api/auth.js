// api/auth.js - VERSIÓN SIMPLIFICADA QUE SÍ FUNCIONA
module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  console.log('📥 Auth API called:', req.method);
  
  // Solo POST para login
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Use POST method' 
    });
  }
  
  try {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log('🔐 Login attempt:', email);
        
        // Usuarios hardcodeados (seguro en backend)
        const validUsers = {
          'admin@tradingdesk.com': 'Admin@Trading2025!',
          'gonzalaz@live.com.ar': 'M+qFS3!Yt2FM',
          'demo@tradingdesk.com': 'Demo123!'
        };
        
        if (validUsers[email] && validUsers[email] === password) {
          console.log('✅ Login successful!');
          
          const userData = {
            email: email,
            name: email === 'admin@tradingdesk.com' ? 'Administrador' : 
                  email === 'gonzalaz@live.com.ar' ? 'Gonzalo' : 'Demo User',
            role: 'admin',
            plan: 'enterprise'
          };
          
          res.status(200).json({
            success: true,
            token: 'tdp_token_' + Date.now(),
            user: userData
          });
        } else {
          console.log('❌ Invalid credentials');
          res.status(401).json({
            success: false,
            message: 'Credenciales incorrectas'
          });
        }
      } catch (error) {
        console.error('❌ JSON parse error:', error);
        res.status(400).json({
          success: false,
          message: 'Invalid JSON format'
        });
      }
    });
  } catch (error) {
    console.error('🚨 Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};