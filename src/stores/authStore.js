// authStore.js - VERSIÓN COMPLETA CORREGIDA
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // Estado
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,
  
  // SOLO 2 USUARIOS DEMO (para mostrar)
  validUsers: [
    {
      email: 'demo@tradingdesk.com',
      password: 'Demo123!',
      role: 'user',
      name: 'Usuario Demo'
    },
    {
      email: 'admin@tradingdesk.com',
      password: 'Admin123!',
      role: 'admin',
      name: 'Administrador'
    }
  ],

  // Método de login CORREGIDO
  login: (email, password, rememberMe = false) => {
    console.log('🔐 Login attempt:', email, 'remember:', rememberMe);
    
    const user = get().validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      // Guardar en localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('remember_me', rememberMe.toString());
      localStorage.setItem('last_activity', Date.now().toString());
      
      set({ 
        currentUser: userData, 
        isAuthenticated: true,
        rememberMe: rememberMe,
        lastActivity: Date.now()
      });
      
      console.log('✅ Login exitoso:', userData);
      return { success: true, user: userData };
    }
    
    console.log('❌ Login fallido para:', email);
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },

  // Logout simple
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('last_activity');
    
    set({ 
      currentUser: null, 
      isAuthenticated: false,
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
        rememberMe: rememberMe,
        lastActivity: lastActivity 
      });
      
      console.log('🔄 Sesión restaurada:', user.email);
    }
  },
  
  // Nueva función para actualizar actividad
  updateActivity: () => {
    localStorage.setItem('last_activity', Date.now().toString());
    set({ lastActivity: Date.now() });
  }
}));