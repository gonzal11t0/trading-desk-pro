import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tdp_token');
    const userStr = localStorage.getItem('tdp_user');

    if (token && userStr && !authStore.isAuthenticated) {
      try {
        authStore.loginSuccess(JSON.parse(userStr), token, localStorage.getItem('tdp_remember') === 'true');
        authStore.updateActivity();
      } catch {
        localStorage.removeItem('tdp_token');
        localStorage.removeItem('tdp_user');
      }
    }
    setIsChecking(false);
  }, [authStore]);

  useEffect(() => {
    if (!authStore.isAuthenticated) return undefined;
    const updateActivity = () => authStore.updateActivity();
    const intervalId = setInterval(updateActivity, 60000);
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [authStore]);

  const logout = () => {
    ['tdp_token', 'tdp_user', 'tdp_remember', 'last_activity'].forEach((key) => localStorage.removeItem(key));
    authStore.logout();
  };

  return {
    isAuthenticated: authStore.isAuthenticated,
    currentUser: authStore.currentUser,
    userRole: authStore.userRole,
    isAdmin: authStore.userRole === 'admin',
    isChecking,
    logout,
    checkSession: authStore.checkTimeout,
    getSessionTimeLeft: () => {
      if (!authStore.lastActivity || !authStore.isAuthenticated) return 0;
      const timeoutMs = authStore.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
      return Math.max(0, Math.floor((timeoutMs - (Date.now() - authStore.lastActivity)) / 1000));
    }
  };
};
