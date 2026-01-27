import { useState, useEffect, useCallback } from 'react';

// URL para Vercel - LO MÁS SIMPLE
const API_BASE = '/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkAuth = useCallback(async () => {
    setIsChecking(true);
    
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      const response = await fetch(`${API_BASE}/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(data.user.plan === 'enterprise');
        setUserData(data.user);
      } else {
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('jwt_token', data.token);
        setIsAuthenticated(true);
        setIsAdmin(data.user.plan === 'enterprise');
        setUserData(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  };

  const loginWithCode = async (code) => {
    try {
      const response = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('jwt_token', data.token);
        setIsAuthenticated(true);
        setIsAdmin(data.user.plan === 'enterprise');
        setUserData(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserData(null);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isAdmin,
    userData,
    isChecking,
    login,
    loginWithCode,
    logout,
    checkAuth,
    getSessionTimeLeft: () => 3600
  };
};