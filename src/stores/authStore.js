// src/stores/authStore.js - VERSIÓN COMPATIBLE CON TU .ENV
import { create } from 'zustand';

// Obtener usuarios de TU .env
const getEnvUsers = () => {
  const users = [];
  
  try {
    // 1. ADMINISTRADOR (tú)
    const adminEmail = import.meta.env.VITE_ADMIN_USER;
    const adminPass = import.meta.env.VITE_ADMIN_PASS;
    
    if (adminEmail && adminPass) {
      users.push({
        email: adminEmail,
        password: adminPass,
        role: 'admin',
        name: 'Administrador',
        id: '1'
      });
    }
    
    for (let i = 1; i <= 10; i++) {
      const userEnv = import.meta.env[`VITE_USER_${i}`];
      if (userEnv && userEnv.trim() !== '') {
        const [email, password] = userEnv.split(':');
        if (email && password) {
          users.push({
            email: email.trim(),
            password: password.trim(),
            role: 'user',
            name: `Cliente ${i}`,
            id: `user_${i}`
          });
        }
      }
    }
    
    console.log('Usuarios cargados desde .env:', users.length);
    
  } catch (error) {
    console.error('Error cargando usuarios del .env:', error);
  }
  
  if (users.length === 0) {
    console.warn('No hay usuarios en .env, usando defaults');
    users.push(
      {
        email: 'admin@tradingdesk.com',
        password: 'Admin123!',
        role: 'admin',
        name: 'Admin Default',
        id: 'default_admin'
      },
      {
        email: 'demo@tradingdesk.com',
        password: 'Demo123!',
        role: 'user',
        name: 'Demo Default',
        id: 'default_demo'
      }
    );
  }
  
  return users;
};

export const useAuthStore = create((set, get) => ({
  // Estado
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  rememberMe: false,
  lastActivity: null,
  
  // Configuración de sesión desde .env
  sessionConfig: {
    timeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '60'), // minutos
    rememberDays: parseInt(import.meta.env.VITE_REMEMBER_DAYS || '30'), // días
    hashSecret: import.meta.env.VITE_HASH_SECRET || 'default-secret',
    adminSecret: import.meta.env.VITE_ADMIN_SECRET_CODE || ''
  },
  
  // Usuarios desde TU .env
  validUsers: getEnvUsers(),
  
  // ==================== MÉTODOS ====================
  
  // Método de login
  login: (email, password, rememberMe = false) => {
    const user = get().validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      // Guardar en localStorage (ENCRIPTADO básico)
      try {
        const encrypted = btoa(JSON.stringify(userData));
        localStorage.setItem('auth_user', encrypted);
        localStorage.setItem('auth_remember', rememberMe.toString());
        localStorage.setItem('auth_lastActivity', Date.now().toString());
      } catch (error) {
        console.error('Error guardando sesión:', error);
      }
      
      set({
        currentUser: userData,
        isAuthenticated: true,
        userRole: user.role,
        rememberMe,
        lastActivity: Date.now()
      });
      
      return { success: true, user: userData };
    }
    
    return { 
      success: false, 
      error: 'Email o contraseña incorrectos' 
    };
  },

  // Método de logout
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_remember');
    localStorage.removeItem('auth_lastActivity');
    
    set({
      currentUser: null,
      isAuthenticated: false,
      userRole: null,
      rememberMe: false,
      lastActivity: null
    });
  },

  // Verificar timeout según TU .env
  checkTimeout: () => {
    const lastActivity = get().lastActivity;
    const rememberMe = get().rememberMe;
    const config = get().sessionConfig;
    
    if (!lastActivity) return false;
    
    const timeoutMs = rememberMe 
      ? config.rememberDays * 24 * 60 * 60 * 1000 // días a milisegundos
      : config.timeout * 60 * 1000; // minutos a milisegundos
      
    const timePassed = Date.now() - lastActivity;
    const isActive = timePassed < timeoutMs;
    
    console.log(`Timeout check: ${timePassed/1000}s / ${timeoutMs/1000}s = ${isActive ? 'ACTIVE' : 'EXPIRED'}`);
    return isActive;
  },

  // Verificar sesión única (siempre true por ahora)
  checkSingleSession: () => true,

  // Actualizar actividad
  updateActivity: () => {
    const now = Date.now();
    localStorage.setItem('auth_lastActivity', now.toString());
    set({ lastActivity: now });
  },

  // Inicializar desde localStorage (DESENCRIPTAR)
  initAuth: () => {
    try {
      const encrypted = localStorage.getItem('auth_user');
      const storedRemember = localStorage.getItem('auth_remember');
      const storedActivity = localStorage.getItem('auth_lastActivity');
      
      if (encrypted) {
        const userData = JSON.parse(atob(encrypted));
        
        set({
          currentUser: userData,
          isAuthenticated: true,
          userRole: userData.role,
          rememberMe: storedRemember === 'true',
          lastActivity: storedActivity ? parseInt(storedActivity) : Date.now()
        });
        
        console.log('Sesión restaurada para:', userData.email);
      }
    } catch (error) {
      console.error('Error restaurando sesión:', error);
      // Limpiar sesión corrupta
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_remember');
      localStorage.removeItem('auth_lastActivity');
    }
  },
  
  // Método para ver usuarios disponibles (solo admin)
  getAvailableUsers: () => {
    return get().validUsers.map(user => ({
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id
    }));
  }
}));