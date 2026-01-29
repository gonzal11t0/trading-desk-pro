// api/auth.js - VERSIÓN CORREGIDA PARA VERCEL
export default function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    const { email, password, rememberMe } = req.body;

    console.log('📥 Login attempt for:', email);

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña requeridos' 
      });
    }

    // Base de datos de usuarios (en memoria)
    const users = {
      // ADMINISTRADOR
      "admin@tradingdesk.com": {
        password: "Admin@Trading2025!", // Cambia esta contraseña
        name: "Administrador",
        role: "admin",
        plan: "enterprise"
      },
      
      // CLIENTES
      "demo@tradingdesk.com": {
        password: "Demo123!", // Cambia esta contraseña
        name: "Usuario Demo",
        role: "client",
        plan: "basic"
      },
      
      // TU USUARIO PERSONAL
      "gonzalaz@live.com.ar": {
        password: "M+qFS3!Yt2FM",
        name: "Gonzalo",
        role: "admin",
        plan: "enterprise"
      }
    };

    // Buscar usuario
    const user = users[email];
    
    // Verificar credenciales
    if (!user || user.password !== password) {
      console.log(`❌ Login fallido para: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    // Crear token seguro
    const tokenData = `${email}:${Date.now()}:${Math.random().toString(36).substr(2)}`;
    const token = Buffer.from(tokenData).toString('base64');
    
    // Datos del usuario (sin password)
    const userData = {
      email: email,
      name: user.name,
      role: user.role,
      plan: user.plan
    };

    console.log(`✅ Login exitoso: ${email} (${user.role})`);
    
    return res.status(200).json({
      success: true,
      token: token,
      user: userData,
      rememberMe: rememberMe || false
    });

  } catch (error) {
    console.error('Error en auth API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}