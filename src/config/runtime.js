export const API_URL = import.meta.env.PROD
  ? '/api/backend'
  : (import.meta.env.VITE_API_URL || '/api/backend');
