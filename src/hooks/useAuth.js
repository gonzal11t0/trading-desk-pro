// src/hooks/useAuth.js - VERSIÓN CORREGIDA
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
        // Inicializar auth desde localStorage
        authStore.initAuth();
        
        // Verificar timeout solo si está autenticado
        if (authStore.isAuthenticated) {
          const isActive = authStore.checkTimeout();
          if (!isActive) {
            authStore.logout();
          } else {
            // Actualizar actividad si sigue activo
            authStore.updateActivity();
          }
        }
        
      } catch (error) {
        console.error('Error en checkAuth:', error);
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    // Pequeño delay
    setTimeout(() => {
      checkAuth();
    }, 100);

    return () => {
      mounted = false;
    };
  }, [authStore]);

  // Actualizar actividad en eventos del usuario
  useEffect(() => {
    let timeoutId;
    
    const updateActivity = () => {
      if (authStore.isAuthenticated) {
        // Debounce para no llamar demasiadas veces
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          authStore.updateActivity();
        }, 1000);
      }
    };

    // Solo agregar listeners si está autenticado
    if (authStore.isAuthenticated) {
      const events = ['mousedown', 'keydown'];
      events.forEach(event => {
        window.addEventListener(event, updateActivity);
      });

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, updateActivity);
        });
        clearTimeout(timeoutId);
      };
    }
  }, [authStore.isAuthenticated, authStore]);
const login = async (email, password, rememberMe = false) => {
  try {
    setIsLoading(true);
    setError('');
    

    // HASHS CORRECTOS - generados desde tu consola
    const validCredentials = {
      // admin@tradingdesk.com:Admin@Trading2025!
      'ZW1haWw9YWRtaW5AdHJhZGluZ2Rlc2suY29tJnBhc3M9QWRtaW5AVHJhZGluZzIwMjUh': true,
      
      // gonzalaz@live.com.ar:M+qFS3!Yt2FM
      'ZW1haWw9Z29uemFsYXpAbGl2ZS5jb20uYXImcGFzcz1NK3FGUzMhWXQyRk0=': true,
      
      // demo@tradingdesk.com:Demo123!
      'ZW1haWw9ZGVtb0B0cmFkaW5nZGVzay5jb20mcGFzcz1EZW1vMTIzIQ==': true
    };

    // Crear hash simple de la credencial
    const credentialHash = btoa(`email=${email}&pass=${password}`);
    
   
    
    if (validCredentials[credentialHash]) {
      
      const userData = {
        email: email,
        name: email === 'admin@tradingdesk.com' ? 'Administrador' : 
              email === 'gonzalaz@live.com.ar' ? 'Gonzalo' : 'Usuario Demo',
        role: 'admin',
        plan: 'enterprise'
      };
      
      const token = 'tdp_' + Date.now() + '_' + Math.random().toString(36).substr(2);
      
      // Guardar en authStore
      authStore.loginSuccess(userData, token, rememberMe);
      
      // También guardar en localStorage
      localStorage.setItem('tdp_token', token);
      localStorage.setItem('tdp_user', JSON.stringify(data.user));
      localStorage.setItem('tdp_remember', rememberMe.toString());
      localStorage.setItem('last_activity', Date.now().toString());
      
      return { success: true, user: userData };
    } else {
     
      throw new Error('Credenciales incorrectas');
    }
    
  } catch (error) {
    setError(error.message);
    return { 
      success: false, 
      error: error.message || 'Error de autenticación' 
    };
  } finally {
    setIsLoading(false);
  }
};




  // Función de logout
  const logout = () => {
    authStore.logout();
    setIsChecking(false);
  };

  return {
    // Estado
    isAuthenticated: authStore.isAuthenticated,
    currentUser: authStore.currentUser,
    userRole: authStore.userRole,
    isAdmin: authStore.userRole === 'admin',
    isChecking,
    isLoading,
    error,
    
    // Métodos
    login,
    logout,
    
    // Utilidades simplificadas
    checkSession: () => {
      if (authStore.isAuthenticated) {
        return authStore.checkTimeout();
      }
      return true;
    },
    
    // Tiempo restante de sesión
    getSessionTimeLeft: () => {
      if (!authStore.lastActivity || !authStore.isAuthenticated) {
        return 0;
      }
      
      const timeoutMs = authStore.rememberMe ? 
        (30 * 24 * 60 * 60 * 1000) : // 30 días
        (60 * 60 * 1000);           // 60 minutos
      
      const timeLeft = timeoutMs - (Date.now() - authStore.lastActivity);
      return Math.max(0, Math.floor(timeLeft / 1000));
    }
  };
};