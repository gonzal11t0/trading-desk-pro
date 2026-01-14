// authStore.js - VERSIÓN SIMPLIFICADA (SOLO USUARIOS DEMO)
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // Estado
  currentUser: null,
  isAuthenticated: false,
  
  // SOLO 2 USUARIOS DEMO (para mostrar)
  validUsers: [
    {
      email: 'demo@tradingdesk.com',
      password: 'Demo123!',
      role: 'user',
      name: 'Usuario Demo'
    },
    {
      email: 'admin@demo.com',
      password: 'Admin123!',
      role: 'admin',
      name: 'Admin Demo'
    }
  ],

  // Método de login SIMPLE
  login: (email, password) => {
    const user = get().validUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      localStorage.setItem('auth_user', JSON.stringify(userData));
      set({ currentUser: userData, isAuthenticated: true });
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },

  // Logout simple
  logout: () => {
    localStorage.removeItem('auth_user');
    set({ currentUser: null, isAuthenticated: false });
  },

  // Verificar si ya está logueado
  checkAuth: () => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      const user = JSON.parse(stored);
      set({ currentUser: user, isAuthenticated: true });
    }
  }
}));