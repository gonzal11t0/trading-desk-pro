// src/api/bonosApi.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const bonosApi = {
  getBonos: async () => {
    try {
      const response = await fetch(`${API_URL}/bonos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (Array.isArray(data)) {
        return data;
      }
      
      throw new Error('Formato de respuesta inesperado');
    } catch (error) {
      console.error('❌ Error en bonosApi:', error);
      throw error;
    }
  }
};