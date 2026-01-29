// src/hooks/useAuth.js - VERSIÓN SIMPLIFICADA Y CORREGIDA
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar estado de autenticación al montar
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      if (!mounted) return;
      
      try {
        authStore.initAuth();
        
        if (authStore.isAuthenticated) {
          const isActive = authStore.checkTimeout();
          if (!isActive) {
            authStore.logout();
          } else {
            authStore.updateActivity();
          }
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    setTimeout(() => checkAuth(), 100);
    return () => { mounted = false; };
  }, [authStore]);

  // Actualizar actividad en eventos
  useEffect(() => {
    let timeoutId;
    
    const updateActivity = () => {
      if (authStore.isAuthenticated) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => authStore.updateActivity(), 1000);
      }
    };

    if (authStore.isAuthenticated) {
      const events = ['mousedown', 'keydown'];
      events.forEach(event => window.addEventListener(event, updateActivity));
      return () => {
        events.forEach(event => window.removeEventListener(event, updateActivity));
        clearTimeout(timeoutId);
      };
    }
  }, [authStore.isAuthenticated, authStore]);

  const login = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError('');

      const validCredentials = {
        // admin@tradingdesk.com:Admin@Trading2025!
        'ZW1haWw9YWRtaW5AdHJhZGluZ2Rlc2suY29tJnBhc3M9QWRtaW5AVHJhZGluZzIwMjUh': {
          role: 'admin',
          name: 'Administrador',
          plan: 'enterprise'
        }
      };

      const credentialHash = btoa(`email=${email}&pass=${password}`);
      const userInfo = validCredentials[credentialHash];
      
      if (userInfo) {
        const userData = {
          email: email,
          name: userInfo.name,
          role: userInfo.role,
          plan: userInfo.plan
        };
        
        const token = 'tdp_' + Date.now();
        
        authStore.loginSuccess(userData, token, rememberMe);
        
        localStorage.setItem('tdp_token', token);
        localStorage.setItem('tdp_user', JSON.stringify(userData));
        localStorage.setItem('tdp_remember', rememberMe.toString());
        localStorage.setItem('last_activity', Date.now().toString());
        
        return { success: true, user: userData };
      } else {
        throw new Error('Credenciales incorrectas');
      }
      
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authStore.logout();
    setIsChecking(false);
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
    
    checkSession: () => {
      if (authStore.isAuthenticated) {
        return authStore.checkTimeout();
      }
      return true;
    },
    
    getSessionTimeLeft: () => {
      if (!authStore.lastActivity || !authStore.isAuthenticated) return 0;
      
      const timeoutMs = authStore.rememberMe ? 
        (30 * 24 * 60 * 60 * 1000) : (60 * 60 * 1000);
      
      const timeLeft = timeoutMs - (Date.now() - authStore.lastActivity);
      return Math.max(0, Math.floor(timeLeft / 1000));
    }
  };
};