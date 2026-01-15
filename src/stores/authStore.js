// authStore.js - VERSIÓN QUE USA .env
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,

  // Obtener usuarios del .env + admin fijo
  getValidUsers: () => {
    const users = [];
    
    // 1. Agregar admin desde .env
    const adminEmail = import.meta.env.VITE_ADMIN_USER;
    const adminPass = import.meta.env.VITE_ADMIN_PASS;
    
    if (adminEmail && adminPass) {
      users.push({
        email: adminEmail,
        password: adminPass,
        role: 'admin',
        name: 'Administrador'
      });
    }
    
    // 2. Agregar usuarios del .env (VITE_USER_1, VITE_USER_2, etc.)
    for (let i = 1; i <= 10; i++) {
      const envVar = import.meta.env[`VITE_USER_${i}`];
      if (envVar && envVar.includes(':')) {
        const [email, password] = envVar.split(':');
        if (email && password) {
          users.push({
            email: email.trim(),
            password: password.trim(),
            role: 'client',
            name: email.split('@')[0]
          });
        }
      }
    }
    
    // 3. Usuario demo de respaldo (opcional)
    if (users.length === 0) {
      users.push({
        email: 'demo@tradingdesk.com',
        password: 'Demo123!',
        role: 'user',
        name: 'Usuario Demo'
      });
    }
    
    return users;
  },

  // Método de login
  login: (email, password, rememberMe = false) => {
    console.log('🔐 Login attempt:', email);
    
    const validUsers = get().getValidUsers();
    const user = validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
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
        rememberMe: rememberMe,
        lastActivity: Date.now()
      });
      
      console.log('✅ Login exitoso. Rol:', userData.role);
      return { success: true, user: userData };
    }
    
    console.log('❌ Login fallido para:', email);
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },

  // ... (resto del código igual)
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
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ 
        currentUser: user, 
        isAuthenticated: true
      });
    }
  }
}));