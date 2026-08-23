// src/hooks/useAuthBackend.js
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { API_URL } from '../config/runtime';

export const useAuthBackend = () => {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      const { user, token } = data;
      if (!token || !user) throw new Error('El backend devolvió una sesión inválida');
      
      authStore.loginSuccess(user, token, rememberMe);
      
      localStorage.setItem('tdp_token', token);
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
    authStore.logout();
  };

  return {
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: authStore.isAuthenticated,
    currentUser: authStore.currentUser,
    isAdmin: authStore.userRole === 'admin'
  };
};
