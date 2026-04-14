// src/hooks/useAuth.js
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://trading-backend.vercel.app/api';

export const useAuth = () => {
  const authStore = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const loginInProgress = useRef(false);

  // Verificar sesión guardada al iniciar (solo una vez)
  useEffect(() => {
    let mounted = true;
    
    const token = localStorage.getItem('tdp_token');
    const userStr = localStorage.getItem('tdp_user');
    
    if (token && userStr && !authStore.isAuthenticated) {
      try {
        const user = JSON.parse(userStr);
        authStore.loginSuccess(user, token, true);
        authStore.updateActivity();
      } catch (e) {
        console.error('Error restaurando sesión:', e);
        localStorage.removeItem('tdp_token');
        localStorage.removeItem('tdp_user');
      }
    }
    
    if (mounted) setIsChecking(false);
    
    return () => { mounted = false; };
  }, []);

  // Actualizar actividad periódicamente
  useEffect(() => {
    let intervalId;
    
    if (authStore.isAuthenticated) {
      intervalId = setInterval(() => {
        authStore.updateActivity();
      }, 60000);
      
      const updateActivity = () => authStore.updateActivity();
      window.addEventListener('mousedown', updateActivity);
      window.addEventListener('keydown', updateActivity);
      
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('mousedown', updateActivity);
        window.removeEventListener('keydown', updateActivity);
      };
    }
  }, [authStore.isAuthenticated]);

  const login = async (email, password, rememberMe = false) => {
  try {
    setIsLoading(true);
    setError('');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Credenciales incorrectas');
    }
    
    // ✅ USAR EL TOKEN REAL DEL BACKEND
    const { token, user } = data;
    
    console.log('✅ Token real recibido:', token.substring(0, 50) + '...');
    
    authStore.loginSuccess(user, token, rememberMe);
    
    localStorage.setItem('tdp_token', token);  // ← Guardar token REAL
    localStorage.setItem('tdp_user', JSON.stringify(user));
    localStorage.setItem('tdp_remember', rememberMe.toString());
    localStorage.setItem('last_activity', Date.now().toString());
    
    return { success: true, user };
    
  } catch (error) {
    setError(error.message);
    return { success: false, error: error.message };
  } finally {
    setIsLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('tdp_token');
    localStorage.removeItem('tdp_user');
    localStorage.removeItem('tdp_remember');
    localStorage.removeItem('last_activity');
    authStore.logout();
  };

  return {
    isAuthenticated: authStore.isAuthenticated,
    currentUser: authStore.currentUser,
    userRole: authStore.userRole,
    isAdmin: authStore.userRole === 'admin',
    isChecking,
    isLoading,
    error,
    login,
    logout,
    checkSession: () => authStore.checkTimeout(),
    getSessionTimeLeft: () => {
      if (!authStore.lastActivity || !authStore.isAuthenticated) return 0;
      const timeoutMs = authStore.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
      return Math.max(0, Math.floor((timeoutMs - (Date.now() - authStore.lastActivity)) / 1000));
    }
  };
};