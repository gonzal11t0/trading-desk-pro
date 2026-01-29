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
    
    console.log('🔐 Enviando credenciales al servidor seguro...');
    console.log('📤 Email:', email);
    console.log('📍 Ruta de API:', '/api/auth');

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    // SOLO UNA LECTURA del response
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText.substring(0, 200));
    console.log('📊 Response status:', response.status);

    // Intentar parsear como JSON
    let data;
    try {
      data = JSON.parse(responseText);  // ← Parsear desde el TEXTO
    } catch (jsonError) {
      console.error('❌ NO ES JSON válido:', responseText.substring(0, 200));
      throw new Error('El servidor devolvió un formato inválido');
    }
    
    if (!data.success) {
      console.log('❌ Error del servidor:', data.message);
      throw new Error(data.message || 'Error de autenticación');
    }

    console.log('✅ Credenciales validadas en el servidor');
    
    // Guardar en authStore (sin contraseñas)
    authStore.loginSuccess(data.user, data.token, rememberMe);
    
    // También guardar en localStorage
    localStorage.setItem('tdp_token', data.token);
    localStorage.setItem('tdp_user', JSON.stringify(data.user));
    localStorage.setItem('tdp_remember', rememberMe.toString());
    localStorage.setItem('last_activity', Date.now().toString());
    
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error('Error en login:', error);
    setError(error.message);
    return { 
      success: false, 
      error: error.message || 'Error de conexión con el servidor' 
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