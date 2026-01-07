import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPassword } from '../utils/authHelpers';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      currentUser: null,
      userRole: null,
      loginTime: null,
      lastActivity: null,
      rememberMe: false,

      // Cargar usuarios desde .env - SIMPLIFICADO
      loadUsers: () => {
        const users = {};
        
        // Cargar admin
        const adminUser = import.meta.env.VITE_ADMIN_USER;
        const adminPass = import.meta.env.VITE_ADMIN_PASS;
        if (adminUser && adminPass) {
          users[adminUser] = {
            password: hashPassword(adminPass),
            email: adminUser,
            role: 'admin',
            name: 'Administrador'
          };
        }

        // Cargar usuarios clientes (solo los que tienen contraseña)
        for (let i = 1; i <= 10; i++) {
          const userVar = import.meta.env[`VITE_USER_${i}`];
          if (userVar && userVar.includes(':')) {
            const [email, password] = userVar.split(':');
            if (email && password) {
              users[email] = {
                password: hashPassword(password),
                email: email,
                role: 'client',
                name: `Cliente ${i}`
              };
            }
          }
        }

        return users;
      },

      // Iniciar sesión - SIMPLIFICADO
      login: (email, password, remember = false) => {
        try {
          const users = get().loadUsers();
          const user = users[email];
          
          if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
          }

          const hashedInput = hashPassword(password);
          if (user.password !== hashedInput) {
            return { success: false, error: 'Contraseña incorrecta' };
          }

          const now = Date.now();
          set({
            isAuthenticated: true,
            currentUser: email,
            userRole: user.role,
            loginTime: now,
            lastActivity: now,
            rememberMe: remember
          });

          return { success: true, user: { email, role: user.role, name: user.name } };
        } catch (error) {
          console.error('Error en login:', error);
          return { success: false, error: 'Error interno' };
        }
      },

      // Cerrar sesión
      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          userRole: null,
          loginTime: null,
          lastActivity: null,
          rememberMe: false
        });
        localStorage.removeItem('activeSession');
      },

      // Verificar timeout - SIMPLIFICADO
      checkTimeout: () => {
        const { lastActivity, rememberMe, isAuthenticated } = get();
        
        if (!isAuthenticated || !lastActivity) return false;
        
        const timeoutMs = rememberMe ? 
          (30 * 24 * 60 * 60 * 1000) : // 30 días
          (60 * 60 * 1000);           // 60 minutos
        
        const isActive = Date.now() - lastActivity < timeoutMs;
        
        if (!isActive) {
          get().logout();
          return false;
        }
        
        return true;
      },

      // Actualizar actividad
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },

      // Verificar sesión única - SIMPLIFICADO
      checkSingleSession: () => {
        const { currentUser, isAuthenticated } = get();
        if (!isAuthenticated || !currentUser) return true;

        const sessionId = `session_${currentUser}`;
        const activeSession = localStorage.getItem('activeSession');
        
        // Si hay sesión activa y no es esta, cerrar
        if (activeSession && activeSession !== sessionId) {
          get().logout();
          return false;
        }
        
        // Marcar esta como la sesión activa
        localStorage.setItem('activeSession', sessionId);
        return true;
      }
    }),
    {
      name: 'trading-desk-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        userRole: state.userRole,
        loginTime: state.loginTime,
        rememberMe: state.rememberMe,
        lastActivity: state.lastActivity
      })
    }
  )
);