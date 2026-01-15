// authStore.js - VERSIÓN CON FALLBACK PARA VERCEL
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // Estado
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,
  userRole: 'user',
  
  // Método para obtener usuarios (con fallback para producción)
  getValidUsers: () => {
    const users = [];
    
    console.log('🔍 Buscando usuarios...');
    console.log('Entorno:', import.meta.env.MODE);
    console.log('VITE_ADMIN_USER definido?', !!import.meta.env.VITE_ADMIN_USER);
    
    // 1. ADMIN (intentar desde .env, luego fallback)
    let adminEmail, adminPassword;
    
    try {
      adminEmail = import.meta.env.VITE_ADMIN_USER;
      adminPassword = import.meta.env.VITE_ADMIN_PASS;
    } catch (error) {
      console.log('⚠️ Error leyendo .env, usando valores por defecto');
      adminEmail = 'gonzalo@admin.com';
      adminPassword = 'Admin@Trading2025!';
    }
    
    if (adminEmail && adminPassword) {
      console.log('✅ Admin configurado:', adminEmail);
      users.push({
        email: adminEmail.trim(),
        password: adminPassword.trim(),
        role: 'admin',
        name: 'Administrador',
        source: 'VITE_ADMIN_USER'
      });
    }
    
    // 2. USUARIOS CLIENTES (con fallback)
    try {
      for (let i = 1; i <= 10; i++) {
        const envVar = import.meta.env[`VITE_USER_${i}`];
        if (envVar && envVar.includes(':')) {
          const [email, password] = envVar.split(':');
          if (email && password) {
            console.log(`✅ Usuario ${i} encontrado:`, email);
            users.push({
              email: email.trim(),
              password: password.trim(),
              role: 'client',
              name: email.split('@')[0],
              source: `VITE_USER_${i}`
            });
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Error leyendo usuarios de .env');
    }
    
    // 3. VALORES POR DEFECTO SI NO HAY NADA
    if (users.length === 0) {
      console.log('⚠️ No hay usuarios en .env, usando valores por defecto');
      
      // ADMIN por defecto
      users.push({
        email: 'gonzalo@admin.com',
        password: 'Admin@Trading2025!',
        role: 'admin',
        name: 'Administrador',
        source: 'default'
      });
      
      // CLIENTE por defecto
      users.push({
        email: 'demo@tradingdesk.com',
        password: 'Demo123!',
        role: 'client',
        name: 'Usuario Demo',
        source: 'default'
      });
      
      // USUARIO de tu .env (gonzalaz@live.com.ar)
      users.push({
        email: 'gonzalaz@live.com.ar',
        password: 'M+qFS3!Yt2FM',
        role: 'client',
        name: 'Cliente',
        source: 'default'
      });
    }
    
    console.log('📋 Total usuarios:', users.length);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) - fuente: ${u.source}`);
    });
    
    return users;
  },

  // Método de login
  login: (email, password, rememberMe = false) => {
    console.log('🔐 Login attempt:', email);
    
    // Obtener usuarios
    const validUsers = get().getValidUsers();
    
    // Buscar usuario
    const user = validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      console.log('✅ Login exitoso. Rol:', user.role);
      
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('remember_me', rememberMe.toString());
      localStorage.setItem('last_activity', Date.now().toString());
      
      set({ 
        currentUser: userData, 
        isAuthenticated: true,
        userRole: user.role,
        rememberMe: rememberMe,
        lastActivity: Date.now()
      });
      
      return { success: true, user: userData };
    } else {
      console.log('❌ Login fallido. Usuarios disponibles:');
      validUsers.forEach(u => console.log(`  - ${u.email}`));
      
      return { 
        success: false, 
        error: 'Credenciales incorrectas' 
      };
    }
  },

  // ... (resto del código igual: logout, checkAuth, updateActivity)
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('last_activity');
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      userRole: 'user',
      rememberMe: false,
      lastActivity: null 
    });
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ 
          currentUser: user, 
          isAuthenticated: true,
          userRole: user.role
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  },
  
  updateActivity: () => {
    localStorage.setItem('last_activity', Date.now().toString());
    set({ lastActivity: Date.now() });
  }
}));