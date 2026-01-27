import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  
  // Login usando el servicio de backend
  login: async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      set({ user: result.user, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, message: result.message };
  },
  
  // Login con código
  loginWithCode: async (code) => {
    const result = await authService.loginWithCode(code);
    if (result.success) {
      set({ user: result.user, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, message: result.message };
  },
  
  // Logout
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  // Verificar sesión
  verifySession: async () => {
    const result = await authService.verifySession();
    set({ 
      user: result.user || null, 
      isAuthenticated: result.isAuthenticated 
    });
    return result;
  }
}));