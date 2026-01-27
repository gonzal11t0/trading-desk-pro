// Configuración del backend
export const BACKEND_CONFIG = {
  // URL del backend - cambiar en producción
  API_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  
  // Endpoints principales
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    LOGIN_CODIGO: '/api/auth/login-codigo',
    VERIFY: '/api/auth/verify',
    LOGOUT: '/api/auth/logout',
    PROXY_BCRA: '/api/proxy/bcra',
    PROXY_COINGECKO: '/api/proxy/coingecko',
    PROXY_GENERIC: '/api/proxy/generic',
  },
  
  // Configuración de tokens
  TOKEN_CONFIG: {
    STORAGE_KEY: 'jwt_token',
    USER_STORAGE_KEY: 'user',
    REFRESH_THRESHOLD: 300000, // 5 minutos antes de expirar
  },
  
  // Planes y permisos
  PLANS: {
    DEMO: {
      features: ['bcra_data', 'basic_charts', 'crypto_data'],
      limits: { api_calls: 100, history_days: 7 }
    },
    PRO: {
      features: ['bcra_data', 'all_charts', 'crypto_data', 'stocks_data', 'news'],
      limits: { api_calls: 1000, history_days: 30 }
    },
    ENTERPRISE: {
      features: ['bcra_data', 'all_charts', 'crypto_data', 'stocks_data', 'news', 'custom_apis', 'admin_panel'],
      limits: { api_calls: 10000, history_days: 365 }
    }
  }
};

// Helper para construir URLs del backend
export const buildBackendUrl = (endpoint) => {
  return `${BACKEND_CONFIG.API_URL}${endpoint}`;
};

// Helper para verificar permisos según plan
export const checkFeaturePermission = (userPlan, feature) => {
  const plan = BACKEND_CONFIG.PLANS[userPlan?.toUpperCase()] || BACKEND_CONFIG.PLANS.DEMO;
  return plan.features.includes(feature);
};