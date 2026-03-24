// src/api/letrasApi.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


export const letrasApi = {
  
  getLetras: async () => {
    try {
      const response = await fetch(`${API_URL}/letras`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error en letrasApi:', error);
      throw error;
    }
  }
};