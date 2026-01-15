// authStore.js - VERSIÓN QUE USA .env
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // Estado
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,
  userRole: 'user',
  
  // Método para obtener usuarios de .env
  getValidUsers: () => {
    const users = [];
    
    console.log('🔍 Buscando usuarios en .env...');
    
    // 1. ADMIN desde VITE_ADMIN_USER / VITE_ADMIN_PASS
    const adminEmail = import.meta.env.VITE_ADMIN_USER;
    const adminPassword = import.meta.env.VITE_ADMIN_PASS;
    
    if (adminEmail && adminPassword) {
      console.log('✅ Admin encontrado en .env:', adminEmail);
      users.push({
        email: adminEmail.trim(),
        password: adminPassword.trim(),
        role: 'admin',
        name: 'Administrador',
        source: 'VITE_ADMIN_USER'
      });
    } else {
      console.log('❌ VITE_ADMIN_USER no definido en .env');
    }
    
    // 2. USUARIOS CLIENTES desde VITE_USER_X
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
    
    // 3. Usuario demo de respaldo (solo si no hay usuarios)
    if (users.length === 0) {
      console.log('⚠️ No hay usuarios en .env, usando demo');
      users.push({
        email: 'demo@tradingdesk.com',
        password: 'Demo123!',
        role: 'user',
        name: 'Usuario Demo',
        source: 'hardcoded'
      });
    }
    
    console.log('📋 Usuarios disponibles:', users.length);
    return users;
  },

  // Método de login - AHORA SÍ LEE DE .env
  login: (email, password, rememberMe = false) => {
    console.log('🔐 Login attempt:', email);
    console.log('🔑 Password length:', password?.length || 0);
    
    // Obtener usuarios actualizados de .env
    const validUsers = get().getValidUsers();
    
    console.log('👥 Usuarios disponibles:', validUsers.map(u => ({
      email: u.email,
      role: u.role,
      source: u.source
    })));
    
    // Buscar usuario
    const user = validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      console.log('✅ USUARIO ENCONTRADO:', {
        email: user.email,
        role: user.role,
        source: user.source
      });
      
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      // Guardar en localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('remember_me', rememberMe.toString());
      localStorage.setItem('last_activity', Date.now().toString());
      
      // Actualizar estado
      set({ 
        currentUser: userData, 
        isAuthenticated: true,
        userRole: user.role,
        rememberMe: rememberMe,
        lastActivity: Date.now()
      });
      
      return { success: true, user: userData };
    } else {
      console.log('❌ USUARIO NO ENCONTRADO');
      console.log('Email buscado:', email);
      console.log('Password buscada:', password ? '******' : 'vacía');
      console.log('Posible error:', {
        emailMatch: validUsers.some(u => u.email === email),
        passwordMatch: validUsers.some(u => u.password === password),
        usersWithSameEmail: validUsers.filter(u => u.email === email)
      });
      
      return { 
        success: false, 
        error: 'Usuario o contraseña incorrectos. Verifica tu .env' 
      };
    }
  },

  // Logout simple
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
    console.log('👋 Usuario deslogueado');
  },

  // Verificar si ya está logueado
  checkAuth: () => {
    const storedUser = localStorage.getItem('auth_user');
    const storedRemember = localStorage.getItem('remember_me');
    const storedActivity = localStorage.getItem('last_activity');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const rememberMe = storedRemember === 'true';
        const lastActivity = storedActivity ? parseInt(storedActivity) : null;
        
        // Verificar timeout solo si no es "remember me"
        const isExpired = !rememberMe && lastActivity && 
          (Date.now() - lastActivity) > (60 * 60 * 1000); // 1 hora
        
        if (isExpired) {
          console.log('⏰ Sesión expirada');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('last_activity');
          return;
        }
        
        set({ 
          currentUser: user, 
          isAuthenticated: true,
          userRole: user.role,
          rememberMe: rememberMe,
          lastActivity: lastActivity 
        });
        
        console.log('🔄 Sesión restaurada:', user.email, 'Rol:', user.role);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  },
  
  // Actualizar actividad
  updateActivity: () => {
    localStorage.setItem('last_activity', Date.now().toString());
    set({ lastActivity: Date.now() });
  }
}));