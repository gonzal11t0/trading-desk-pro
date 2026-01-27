// Configuración del backend
const BACKEND_URL = 'http://localhost:3001';

// Servicio de autenticación
export const authService = {
  // Login con email/contraseña
  async login(email, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error || 'Error en login' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor' 
      };
    }
  },

  // Login con código (simple para usuarios)
  async loginWithCode(code) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/login-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error || 'Código inválido' };
      }
    } catch (error) {
      console.error('Error en login con código:', error);
      return { 
        success: false, 
        message: 'Error de conexión' 
      };
    }
  },

  // Verificar sesión actual
  async verifySession() {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      return { success: false, isAuthenticated: false };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return { 
          success: true, 
          isAuthenticated: true, 
          user: data.user 
        };
      } else {
        // Token inválido, limpiar
        this.logout();
        return { success: false, isAuthenticated: false };
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return { 
        success: false, 
        isAuthenticated: false 
      };
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    // Redirigir a login
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('jwt_token');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('jwt_token');
  }
};