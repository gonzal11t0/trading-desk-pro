// src/stores/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  lastActivity: null,
  rememberMe: false,
  userRole: 'user',
  
  loginSuccess: (userData, token, rememberMe) => {
    // Evitar loops
    if (get().isAuthenticated && get().currentUser?.email === userData.email) {
      return;
    }
    
    set({ 
      currentUser: userData, 
      isAuthenticated: true,
      userRole: userData.role,
      rememberMe: rememberMe,
      lastActivity: Date.now()
    });
  },
  
  logout: () => {
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      userRole: 'user',
      rememberMe: false,
      lastActivity: null 
    });
  },

  updateActivity: () => {
    set({ lastActivity: Date.now() });
  },
  
  checkTimeout: () => {
    const state = get();
    if (!state.lastActivity) return false;
    
    const timeoutMs = state.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const isActive = (Date.now() - state.lastActivity) < timeoutMs;
    
    if (!isActive) state.logout();
    return isActive;
  }
}));