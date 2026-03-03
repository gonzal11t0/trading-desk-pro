// src/api/bonosApi.js
const API_URL = import.meta.env.VITE_API_URL;

export const bonosApi = {
  getBonos: async () => {
    try {
      const response = await fetch(`${API_URL}/bonos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Bonos cargados:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error en bonosApi:', error);
      throw error;
    }
  }
};