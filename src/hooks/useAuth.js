import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook personalizado para manejo de autenticación - VERSIÓN CORREGIDA
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Verificar estado de autenticación al montar - CORREGIDO
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

  // Actualizar actividad en eventos del usuario - CORREGIDO
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

  // Función de login - SIMPLIFICADA
  const login = async (email, password, rememberMe = false) => {
    try {
      setIsChecking(true);
      const result = authStore.login(email, password, rememberMe);
      
      if (result.success) {
        console.log(`✅ Login exitoso: ${email}`);
        // Pequeño delay para que se actualice el estado
        setTimeout(() => setIsChecking(false), 100);
        return { success: true, user: result.user };
      } else {
        console.log(`❌ Login fallido: ${email} - ${result.error}`);
        setIsChecking(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      setIsChecking(false);
      return { success: false, error: 'Error interno del sistema' };
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