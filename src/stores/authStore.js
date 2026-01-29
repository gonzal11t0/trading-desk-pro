// authStore.js - VERSIÓN CON FALLBACK PARA VERCEL
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // Estado (MANTENER)
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,
  userRole: 'user',
  
loginSuccess: (userData, token, rememberMe) => {
  console.log('🔄 Login exitoso desde useAuth');
  
  set({ 
    currentUser: userData, 
    isAuthenticated: true,
    userRole: userData.role,
    rememberMe: rememberMe,
    lastActivity: Date.now()
  });
  
  return { success: true, user: userData };
},
  // MODIFICADA: Función de login (ahora solo maneja el estado, NO valida)
  login: (email, password, rememberMe = false) => {
    console.log('⚠️ Esta función ya no valida credenciales. Usa el hook useAuth()');
    
    // Esto solo se llamará después de que el backend valide
    // Mantenemos la función por compatibilidad
    return { 
      success: false, 
      error: 'Usa useAuth().login() en su lugar' 
    };
  },

  // MANTENER el resto de funciones igual...
  logout: () => {
    localStorage.removeItem('tdp_token');
    localStorage.removeItem('tdp_user');
    localStorage.removeItem('tdp_remember');
    localStorage.removeItem('last_activity');
    localStorage.removeItem('auth_user'); // viejo
    localStorage.removeItem('remember_me'); // viejo
    
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      userRole: 'user',
      rememberMe: false,
      lastActivity: null 
    });
  },

  initAuth: () => {
    const token = localStorage.getItem('tdp_token');
    const userStr = localStorage.getItem('tdp_user');
    const remember = localStorage.getItem('tdp_remember');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const rememberMe = remember === 'true';
        
        set({ 
          currentUser: user, 
          isAuthenticated: true,
          userRole: user.role,
          rememberMe: rememberMe,
          lastActivity: parseInt(localStorage.getItem('last_activity') || Date.now().toString())
        });
        
        console.log('✅ Sesión recuperada para:', user.email);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        get().logout();
      }
    }
  },
  
  updateActivity: () => {
    localStorage.setItem('last_activity', Date.now().toString());
    set({ lastActivity: Date.now() });
  },
  
  checkTimeout: () => {
    const lastActivity = get().lastActivity;
    const rememberMe = get().rememberMe;
    
    if (!lastActivity) return false;
    
    const timeoutMs = rememberMe ? 
      (30 * 24 * 60 * 60 * 1000) : // 30 días
      (60 * 60 * 1000);           // 60 minutos
    
    const timePassed = Date.now() - lastActivity;
    const isActive = timePassed < timeoutMs;
    
    if (!isActive) {
      console.log('⌛ Sesión expirada por inactividad');
      get().logout();
    }
    
    return isActive;
  }
}));